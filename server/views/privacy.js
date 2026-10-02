// HTML généré par des fonctions JavaScript natives ; aucune dépendance React.
import { html, Fragment } from '../html.js';
import { siteConfig } from '../../site-config.js';

export default function PrivacyPage() {
  return html("main", {
    className: "section-shell section-pad",
    style: {
      minHeight: '100vh'
    },
    children: [html("div", {
      className: "section-heading",
      children: [html("p", {
        className: "eyebrow",
        children: "Protection des invit\xE9s"
      }), html("h1", {
        children: "Politique de confidentialit\xE9"
      })]
    }), html("section", {
      className: "story-text",
      style: {
        maxWidth: 820,
        margin: '0 auto'
      },
      children: [html("p", {
        children: ["Cette page explique comment les informations communiqu\xE9es via l\u2019invitation RSVP sont utilis\xE9es pour organiser le mariage de ", siteConfig.couple.names, "."]
      }), html("h2", {
        children: "Responsable des donn\xE9es"
      }), html("p", {
        children: [html("strong", {
          children: "Organisateur / responsable :"
        }), " ", siteConfig.privacy.operator]
      }), html("p", {
        children: [html("strong", {
          children: "Contact confidentialit\xE9 :"
        }), " ", siteConfig.privacy.contact]
      }), html("h2", {
        children: "Informations recueillies"
      }), html("p", {
        children: "Le formulaire peut recueillir le nom, le num\xE9ro de t\xE9l\xE9phone, une adresse e-mail facultative, la r\xE9ponse de pr\xE9sence, le nombre d\u2019accompagnants, leurs noms lorsque cette option est utilis\xE9e, une pr\xE9f\xE9rence de boisson, une proposition de chanson et un message facultatif. Pour une invitation nominative, l\u2019organisateur associe \xE9galement l\u2019invit\xE9 \xE0 une table et \xE0 un lien personnel."
      }), html("h2", {
        children: "Pourquoi ces informations sont utilis\xE9es"
      }), html("p", {
        children: "Elles servent uniquement \xE0 pr\xE9parer la liste des invit\xE9s, suivre les confirmations, organiser les tables et faciliter l\u2019accueil le jour de l\u2019\xE9v\xE9nement. Elles ne sont pas affich\xE9es sur la partie publique du Site."
      }), html("h2", {
        children: "H\xE9bergement et prestataire technique"
      }), html("p", {
        children: "Cette version est h\xE9berg\xE9e par le prestataire choisi par les organisateurs. Les confirmations sont conserv\xE9es dans une base SQLite du serveur. Les organisateurs doivent pr\xE9ciser les coordonn\xE9es de leur h\xE9bergeur avant publication."
      }), html("p", {
        children: "L\u2019espace organisateur est prot\xE9g\xE9 par un mot de passe et une session. Un cookie strictement n\xE9cessaire permet de maintenir cette connexion. Les QR codes sont g\xE9n\xE9r\xE9s par api.qrserver.com, qui re\xE7oit le lien d\u2019invitation personnel n\xE9cessaire \xE0 leur cr\xE9ation."
      }), html("h2", {
        children: "Dur\xE9e de conservation"
      }), html("p", {
        children: [html("strong", {
          children: "Dur\xE9e pr\xE9vue :"
        }), " ", siteConfig.privacy.retention]
      }), html("p", {
        children: "Les organisateurs doivent supprimer les informations lorsqu\u2019elles ne sont plus n\xE9cessaires \xE0 l\u2019organisation de l\u2019\xE9v\xE9nement, sauf obligation l\xE9gale applicable."
      }), html("h2", {
        children: "Vos demandes"
      }), html("p", {
        children: "Selon les lois applicables, vous pouvez notamment demander l\u2019acc\xE8s, la correction ou la suppression des informations vous concernant. Utilisez le contact indiqu\xE9 ci-dessus pour toute demande."
      }), html("h2", {
        children: "Transferts et localisation des donn\xE9es"
      }), html("p", {
        children: "La localisation des donn\xE9es et les conditions de transfert d\xE9pendent de l\u2019h\xE9bergeur choisi et du service de g\xE9n\xE9ration des QR codes. Les organisateurs doivent v\xE9rifier et pr\xE9ciser ces informations avant publication."
      }), html("p", {
        children: html("a", {
          className: "button button-ghost",
          href: "/",
          children: "Retour \xE0 l\u2019invitation"
        })
      })]
    })]
  });
}
