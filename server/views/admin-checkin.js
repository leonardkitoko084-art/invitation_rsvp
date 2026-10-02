// HTML généré par des fonctions JavaScript natives ; aucune dépendance React.
import { html, Fragment } from '../html.js';
import { AdminFooter, AdminGate, AdminHeader, AdminTabs } from './admin-ui.js';
import { currentAdminAccess } from '../auth.js';
import { RuntimeScript } from '../html.js';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export default async function CheckinPage() {
  const access = await currentAdminAccess();
  if (!access.ok) return html(AdminGate, {
    access: access
  });
  return html(Fragment, {
    children: [html(AdminHeader, {}), html("main", {
      className: "dashboard",
      children: [html(AdminTabs, {
        active: "checkin"
      }), html("section", {
        className: "dashboard-intro",
        children: html("div", {
          children: [html("p", {
            className: "brand",
            children: "Accueil des invit\xE9s"
          }), html("h1", {
            children: "Contr\xF4le \xE0 l\u2019entr\xE9e."
          }), html("p", {
            className: "intro-copy",
            children: "Scannez le QR Code de l\u2019invit\xE9, puis validez son arriv\xE9e."
          })]
        })
      }), html("section", {
        className: "checkin-panel management-panel",
        children: [html("p", {
          className: "checkin-icon",
          "aria-hidden": "true",
          children: "\u2301"
        }), html("h2", {
          children: "Scanner une invitation"
        }), html("p", {
          className: "field-help",
          children: "Autorisez la cam\xE9ra, pr\xE9sentez le QR Code devant l\u2019objectif, puis v\xE9rifiez le nom et la table."
        }), html("div", {
          className: "scanner-frame",
          id: "scannerFrame",
          hidden: true,
          children: html("video", {
            id: "scannerVideo",
            playsInline: true,
            muted: true
          })
        }), html("button", {
          className: "admin-button primary",
          id: "startScanner",
          type: "button",
          children: "Activer la cam\xE9ra"
        }), html("p", {
          className: "field-help",
          id: "scannerStatus",
          role: "status",
          "aria-live": "polite",
          children: "Vous pouvez aussi saisir le code du lien manuellement."
        }), html("form", {
          id: "checkinForm",
          className: "checkin-manual",
          children: [html("label", {
            children: ["Code du QR ou lien d\u2019invitation", html("input", {
              id: "tokenInput",
              name: "token",
              required: true,
              placeholder: "Collez le lien ou le code"
            })]
          }), html("button", {
            className: "admin-button secondary",
            type: "submit",
            children: "V\xE9rifier l\u2019invit\xE9"
          })]
        }), html("div", {
          id: "checkinResult",
          className: "checkin-result",
          hidden: true
        })]
      }), html(AdminFooter, {})]
    }), html(RuntimeScript, {
      src: "/assets/js/checkin.js"
    })]
  });
}
