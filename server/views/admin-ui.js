// HTML généré par des fonctions JavaScript natives ; aucune dépendance React.
import { html, Fragment } from '../html.js';
import { siteConfig } from '../../site-config.js';

export function AdminGate({
  access
}) {
  if (access.ok) return null;
  return html("main", {
    className: "auth-shell",
    children: html("section", {
      className: "auth-card",
      children: [html("p", {
        className: "brand",
        children: "LEO RSVP"
      }), html("h1", {
        children: "Espace organisateur"
      }), access.reason === 'not-configured' ? html("p", {
        children: ["Configurez votre mot de passe avec la commande ", html("code", {
          children: "npm run admin:setup"
        }), ", puis relancez le serveur."]
      }) : html(Fragment, {
        children: [html("p", {
          children: "Connectez-vous pour administrer cet \xE9v\xE9nement."
        }), html("form", {
          method: "post",
          action: "/api/admin/login",
          children: [html("label", {
            children: ["Mot de passe", html("input", {
              type: "password",
              name: "password",
              autoComplete: "current-password",
              required: true
            })]
          }), html("button", {
            type: "submit",
            children: "Se connecter"
          })]
        })]
      }), html("a", {
        href: "/",
        children: "Retour \xE0 l\u2019invitation"
      })]
    })
  });
}
export function AdminHeader() {
  return html("header", {
    className: "admin-header",
    children: [html("a", {
      className: "admin-identity",
      href: "/admin",
      target: "_top",
      "aria-label": "Tableau de bord",
      children: [html("img", {
        className: "admin-avatar",
        src: "/favicon.svg",
        alt: "Monogramme du mariage"
      }), html("span", {
        children: [html("strong", {
          children: "LEO RSVP"
        }), html("small", {
          children: "Espace organisateur"
        })]
      })]
    }), html("nav", {
      "aria-label": "Navigation administrateur",
      children: html("a", {
        className: "nav-link logout-link",
        href: "/logout",
        target: "_top",
        children: "D\xE9connexion"
      })
    })]
  });
}
export function AdminTabs({
  active
}) {
  return html("nav", {
    className: "admin-tabs",
    "aria-label": "Gestion du mariage",
    children: [html("a", {
      href: "/admin",
      target: "_top",
      "aria-current": active === 'index' ? 'page' : undefined,
      children: "R\xE9ponses & statistiques"
    }), html("a", {
      href: "/admin/tables",
      target: "_top",
      "aria-current": active === 'tables' ? 'page' : undefined,
      children: "Tables"
    }), html("a", {
      href: "/admin/guests",
      target: "_top",
      "aria-current": active === 'guests' ? 'page' : undefined,
      children: "Invit\xE9s & invitations"
    }), html("a", {
      href: "/admin/checkin",
      target: "_top",
      "aria-current": active === 'checkin' ? 'page' : undefined,
      children: "Contr\xF4le d\u2019entr\xE9e"
    })]
  });
}
export function AdminFooter() {
  return html("footer", {
    className: "admin-footer",
    children: [html("p", {
      className: "script-name",
      children: siteConfig.couple.names
    }), html("p", {
      children: siteConfig.event.dateDisplay
    }), html("div", {
      className: "footer-actions",
      children: [html("a", {
        href: "/",
        target: "_top",
        children: "Retour \xE0 l\u2019invitation \u2191"
      }), html("a", {
        href: "/logout?return_to=%2F",
        target: "_top",
        children: "D\xE9connexion"
      })]
    }), html("small", {
      children: ["Invitation digitale con\xE7ue par ", html("a", {
        className: "brand-link",
        href: "https://www.leodesign.tech",
        target: "_blank",
        rel: "noopener noreferrer",
        children: siteConfig.brand
      })]
    })]
  });
}
