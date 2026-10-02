// HTML généré par des fonctions JavaScript natives ; aucune dépendance React.
import { html, Fragment } from '../html.js';
import { AdminFooter, AdminGate, AdminHeader, AdminTabs } from './admin-ui.js';
import { currentAdminAccess } from '../auth.js';
import { listGuests, listResponses, listTables } from '../guestbook.js';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export default async function TablesPage({
  searchParams
}) {
  const access = await currentAdminAccess();
  if (!access.ok) return html(AdminGate, {
    access: access
  });
  const [tables, guests, responses, params] = await Promise.all([listTables(), listGuests(), listResponses(), searchParams]);
  const responseByGuest = new Map(responses.filter(row => row.invitation_id).map(row => [row.invitation_id, row]));
  return html(Fragment, {
    children: [html(AdminHeader, {}), html("main", {
      className: "dashboard",
      children: [html(AdminTabs, {
        active: "tables"
      }), html("section", {
        className: "dashboard-intro",
        children: [html("div", {
          children: [html("p", {
            className: "brand",
            children: "Le plan de salle"
          }), html("h1", {
            children: "Une place pour chacun."
          }), html("p", {
            className: "intro-copy",
            children: "Enregistrez vos tables, puis affectez les invit\xE9s depuis leur fiche."
          })]
        }), html("a", {
          className: "admin-button primary",
          href: "/admin/guests",
          target: "_top",
          children: "G\xE9rer les invit\xE9s"
        })]
      }), params.error ? html("p", {
        className: "alert error",
        role: "alert",
        children: params.error
      }) : null, params.notice ? html("p", {
        className: "alert success",
        role: "status",
        children: params.notice
      }) : null, html("section", {
        className: "management-panel",
        children: [html("h2", {
          children: "Ajouter les tables"
        }), html("form", {
          method: "post",
          action: "/api/admin/tables",
          target: "_top",
          className: "management-form",
          children: [html("input", {
            type: "hidden",
            name: "action",
            value: "tables"
          }), html("label", {
            children: ["Nom ou num\xE9ro des tables", html("textarea", {
              name: "names",
              required: true,
              rows: 4,
              maxLength: 12000,
              placeholder: 'Orchidée\nRose\nTable 3'
            })]
          }), html("p", {
            className: "field-help",
            children: "Une table par ligne. Vous pouvez enregistrer toute votre liste en une seule fois."
          }), html("button", {
            className: "admin-button primary",
            type: "submit",
            children: "Enregistrer les tables"
          })]
        })]
      }), html("div", {
        className: "directory-heading",
        children: [html("h2", {
          children: [tables.length, " table", tables.length !== 1 ? 's' : '', " enregistr\xE9e", tables.length !== 1 ? 's' : '']
        }), html("a", {
          href: "/admin/guests",
          target: "_top",
          children: "Affecter les invit\xE9s \u2192"
        })]
      }), html("div", {
        className: "tables-directory",
        children: tables.map(table => {
          const tableGuests = guests.filter(guest => guest.table_id === table.id);
          const confirmed = tableGuests.reduce((total, guest) => {
            const reply = responseByGuest.get(guest.id);
            return total + ((reply === null || reply === void 0 ? void 0 : reply.attending) === 'yes' ? Number(guest.party_size || 1) : 0);
          }, 0);
          return html("details", {
            className: "management-panel table-record",
            children: [html("summary", {
              className: "table-summary",
              children: [html("span", {
                children: table.name
              }), html("small", {
                children: [tableGuests.length, " invit\xE9(s) \xB7 ", confirmed, " confirm\xE9(s)"]
              }), html("b", {
                "aria-hidden": "true",
                children: "\uFF0B"
              })]
            }), html("div", {
              className: "table-detail",
              children: [html("p", {
                className: "field-help",
                children: [tableGuests.length, " invitation(s) affect\xE9e(s) \xB7 ", confirmed, " personne(s) confirm\xE9e(s)"]
              }), tableGuests.length ? html("ul", {
                className: "table-guest-list",
                children: tableGuests.map(guest => html("li", {
                  children: html("a", {
                    href: `/admin/guests?edit=${encodeURIComponent(guest.id)}#new-guest`,
                    target: "_top",
                    children: guest.name
                  })
                }, guest.id))
              }) : html("p", {
                className: "field-help",
                children: "Aucun invit\xE9 affect\xE9 pour le moment."
              }), html("div", {
                className: "record-actions",
                children: [html("a", {
                  className: "admin-button secondary",
                  href: `/admin/guests?table=${encodeURIComponent(table.id)}#new-guest`,
                  target: "_top",
                  children: "Ajouter un invit\xE9 \xE0 cette table"
                }), html("form", {
                  method: "post",
                  action: "/api/admin/tables",
                  target: "_top",
                  "data-confirm": "Supprimer cette table ? Elle doit \xEAtre vide.",
                  children: [html("input", {
                    type: "hidden",
                    name: "action",
                    value: "delete_table"
                  }), html("input", {
                    type: "hidden",
                    name: "id",
                    value: table.id
                  }), html("button", {
                    className: "admin-button danger",
                    type: "submit",
                    children: "Supprimer la table"
                  })]
                })]
              }), html("details", {
                className: "management-details",
                children: [html("summary", {
                  children: "Renommer la table"
                }), html("form", {
                  method: "post",
                  action: "/api/admin/tables",
                  target: "_top",
                  className: "management-form",
                  children: [html("input", {
                    type: "hidden",
                    name: "action",
                    value: "rename_table"
                  }), html("input", {
                    type: "hidden",
                    name: "id",
                    value: table.id
                  }), html("label", {
                    children: ["Nouveau nom", html("input", {
                      name: "name",
                      required: true,
                      maxLength: 60,
                      defaultValue: table.name
                    })]
                  }), html("button", {
                    className: "admin-button secondary",
                    type: "submit",
                    children: "Enregistrer le nom"
                  })]
                })]
              })]
            })]
          }, table.id);
        })
      }), !tables.length ? html("div", {
        className: "empty-state",
        children: [html("h3", {
          children: "Votre plan de salle commence ici."
        }), html("p", {
          children: "Ajoutez les noms ou les num\xE9ros des tables ci-dessus."
        })]
      }) : null, html(AdminFooter, {})]
    })]
  });
}
