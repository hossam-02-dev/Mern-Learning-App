import Paiement from "../models/PaiementModel.js";
import Course from "../models/CourseModel.js";
import User from "../models/UserModel.js";  // ✅ AJOUT
import dotenv from "dotenv";
dotenv.config();
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);


export const Getpaiement = async(req,res) => {

try {

const onepaiement = await Paiement.findById(req.params.id);
if (!onepaiement) {
return res.status(404).json({success : false ,
   message : `Le paiement ayant l'identifiant :  ${req.params.id} est introuvable.`});

}
return res.status(200).json({success : true ,
 message : `Le paiement ayant l'identifiant : ${req.params.id} est recuperé avec succès.`,
 data : onepaiement,

})
}  

catch (error) {
console.error(error);
return res.status(500).json({success : false , message : "Echec de recupération du paiement."})

}};

export const GetAllPaiementsForUser = async(req,res) => {
try {
const getallpaiement = await Paiement.find();
if (!getallpaiement) {
return res.status(404).json({success : false ,
   message : "Paiement introuvable.",
  });

}
return res.status(200).json({success : true,
message : "Recupération de tous les paiements avec succès.",
data : getallpaiement,

})

}  catch(error) {
console.error(error);
return res.status(500).json({success : false ,
message : "Echec de recupération des paiements."


})
}


}




export const Preparepaiement = async (req, res) => {
  // ✅ MODIFICATION 1 : Extraire userId de req.user
  const userId = req.user._id;
  const { courseId, provider } = req.body;

  try {
    // ✅ MODIFICATION 2 : Vérification sans userId
    if (!courseId || !provider) {
      return res.status(400).json({ 
        success: false, 
        message: "Veuillez fournir courseId et provider." 
      });
    }

    // Vérifier si le paiement a déjà été effectué
    const existingPaiement = await Paiement.findOne({ 
      userId, 
      courseId, 
      status: { $in: ["success", "succeeded"] }  // ✅ Amélioré
    });
    if (existingPaiement) {
      return res.status(400).json({ 
        success: false, 
        message: "Paiement déjà effectué pour ce cours." 
      });
    }

    // Vérifier que le cours existe
    const presentCourse = await Course.findById(courseId);
    if (!presentCourse) {
      return res.status(404).json({ 
        success: false, 
        message: `Cours ${courseId} introuvable.` 
      });
    }

    // Créer un paiement "pending"
    const newPaiement = await Paiement.create({
      userId,
      courseId,
      montant: presentCourse.price,
      provider,
      status: "pending",
      devise: "DH",  // ✅ MODIFICATION 3 : Changé en DH
      paymentMethod: provider === "stripe" ? "card" : "paypal",
      transactionId: null,
      receiptUrl: null,
      paidAt: null,
      notes: "Paiement en attente de validation.",
    });

    // Créer la session Stripe si le provider est Stripe
    let sessionUrl = null;
    if (provider === "stripe") {
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [
          {
            price_data: {
              currency: "usd",  // ✅ MODIFICATION 4 : Changé (ou "mad" si supporté)
              product_data: {
                name: presentCourse.title,
                description: presentCourse.description,  // ✅ AJOUT
              },
              unit_amount: Math.round(presentCourse.price * 100),  // ✅ Sécurité
            },
            quantity: 1,
          },
        ],
        mode: "payment",
        // ✅ MODIFICATION 5 : AJOUT CRITIQUE - metadata
        metadata: {
          paiementId: newPaiement._id.toString(),
          userId: userId.toString(),
          courseId: courseId.toString(),
        },
        // ✅ MODIFICATION 6 : URLs corrigées
        success_url: `${process.env.FRONTEND_URL}/payment/success?paymentId=${newPaiement._id}`,
        cancel_url: `${process.env.FRONTEND_URL}/payment/cancel?paymentId=${newPaiement._id}`,
      });

      sessionUrl = session.url;
    }

    return res.status(201).json({
      success: true,
      message: "Paiement préparé avec succès.",
      data: {
        paiementId: newPaiement._id,
        checkoutUrl: sessionUrl,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ 
      success: false, 
      message: "Erreur lors de la préparation du paiement.",
      error: error.message  // ✅ AJOUT pour debug
    });
  }
};


export const Checkpaiement = async (req, res) => {
  const { id, provider, transactionId } = req.body;

  try {
    const paiement = await Paiement.findById(id);
    if (!paiement) {
      return res.status(404).json({ success: false, message: "Paiement introuvable." });
    }

    if (paiement.status === "success") {
      return res.status(400).json({ success: false, message: "Ce paiement est déjà validé." });
    }

    // (En production, vérifier ici la transaction avec l'API Stripe/PayPal)

    paiement.status = "success";
    paiement.transactionId = transactionId || `txn_${Date.now()}`;
    paiement.paidAt = new Date();
    paiement.paymentMethod = provider === "stripe" ? "card" : "paypal";
    paiement.devise = paiement.devise || "DH";  // ✅ Changé en DH
    paiement.receiptUrl = paiement.receiptUrl || `${process.env.FRONTEND_URL}/receipt/${paiement._id}`;
    paiement.notes = paiement.notes || `Paiement confirmé via ${provider}.`;

    await paiement.save();

    return res.status(200).json({
      success: true,
      message: "Paiement confirmé avec succès.",
      data: paiement,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Erreur lors de la vérification du paiement.",
    });
  }
};



    
                   
export const StripeWebhook = async (req, res) => {
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    // ✅ Vérification de la signature envoyée par Stripe
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("❌ Erreur de vérification du webhook :", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object;
        const paiementId = session.metadata?.paiementId;

        if (paiementId) {
          // ✅ MODIFICATION 7 : LOGIQUE COMPLÈTE D'INSCRIPTION
          // 1. Récupérer le paiement
          const paiement = await Paiement.findById(paiementId);
          
          if (!paiement) {
            console.error("❌ Paiement introuvable :", paiementId);
            break;
          }

          // 2. Mettre à jour le paiement
          paiement.status = "succeeded";
          paiement.transactionId = session.payment_intent;
          paiement.paidAt = new Date();
          await paiement.save();

          // ✅ 3. Inscrire l'étudiant au cours
          const course = await Course.findById(paiement.courseId);
          if (course && !course.studentsEnrolled.includes(paiement.userId)) {
            course.studentsEnrolled.push(paiement.userId);
            await course.save();
            console.log("✅ Étudiant ajouté au cours");
          }

          // ✅ 4. Ajouter le cours à l'utilisateur
          const user = await User.findById(paiement.userId);
          if (user && !user.coursesEnrolled.includes(paiement.courseId)) {
            user.coursesEnrolled.push(paiement.courseId);
            await user.save();
            console.log("✅ Cours ajouté à l'utilisateur");
          }

          console.log(`✅ Paiement confirmé : ${paiementId}`);
        } else {
          console.warn("⚠️ Aucun paiementId trouvé dans la session Stripe.");
        }
        break;
      }

      case "payment_intent.payment_failed": {
        const intent = event.data.object;
        console.error(`❌ Échec du paiement : ${intent.last_payment_error?.message}`);
        break;
      }

      default:
        console.log(`ℹ️ Événement non traité : ${event.type}`);
    }

    // ✅ Réponse Stripe (obligatoire pour éviter les répétitions)
    res.status(200).json({ received: true });
  } catch (error) {
    console.error("❌ Erreur interne lors du traitement du webhook :", error);
    res.status(500).send("Erreur serveur interne.");
  }
};

// ✅ NOUVELLE FONCTION : Finaliser le paiement manuellement
export const FinalizePaiement = async (req, res) => {
  try {
    const { paymentId } = req.params;
    const userId = req.user._id;

    console.log("🔍 Finalisation du paiement:", paymentId);

    // Récupérer le paiement
    const paiement = await Paiement.findById(paymentId);
    
    if (!paiement) {
      return res.status(404).json({ 
        success: false, 
        message: "Paiement introuvable." 
      });
    }

    // Vérifier que c'est bien le bon utilisateur
    if (paiement.userId.toString() !== userId.toString()) {
      return res.status(403).json({ 
        success: false, 
        message: "Accès non autorisé à ce paiement." 
      });
    }

    // Si déjà traité, renvoyer succès
    if (paiement.status === "success" || paiement.status === "succeeded") {
      return res.status(200).json({
        success: true,
        message: "Paiement déjà confirmé.",
        data: paiement
      });
    }

    // Mettre à jour le paiement
    paiement.status = "success";
    paiement.transactionId = paiement.transactionId || `txn_${Date.now()}`;
    paiement.paidAt = new Date();
    await paiement.save();

    // ✅ AJOUTER L'ÉTUDIANT AU COURS
    const course = await Course.findById(paiement.courseId);
    if (course && !course.studentsEnrolled.includes(userId)) {
      course.studentsEnrolled.push(userId);
      await course.save();
      console.log("✅ Étudiant ajouté au cours");
    }

    // ✅ AJOUTER LE COURS À L'UTILISATEUR
    const user = await User.findById(userId);
    if (user && !user.coursesEnrolled.includes(paiement.courseId)) {
      user.coursesEnrolled.push(paiement.courseId);
      await user.save();
      console.log("✅ Cours ajouté à l'utilisateur");
    }

    return res.status(200).json({
      success: true,
      message: "Paiement confirmé et cours débloqué avec succès !",
      data: paiement
    });

  } catch (error) {
    console.error("❌ Erreur finalisation paiement:", error);
    return res.status(500).json({
      success: false,
      message: "Erreur lors de la finalisation du paiement.",
      error: error.message
    });
  }
};