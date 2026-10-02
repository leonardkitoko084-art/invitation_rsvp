// HTML généré par des fonctions JavaScript natives ; aucune dépendance React.
import { html, Fragment } from '../html.js';
import { AdminFooter, AdminGate, AdminHeader, AdminTabs } from './admin-ui.js';
import { currentAdminAccess } from '../auth.js';
import { listGuests, listResponses, listTables } from '../guestbook.js';
import { siteConfig } from '../../site-config.js';
import { currentSiteBaseUrl } from '../site-url.js';
import { RuntimeScript } from '../html.js';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
function whatsappUrl(name, phone, table, invitationLink) {
  if (!phone || !table || !invitationLink) return '';
  const number = phone.replace(/\D/g, '');
  if (!number) return '';
  const message = `Bonjour ${name},\n\n${siteConfig.couple.names} ont le plaisir de vous inviter à leur mariage le ${siteConfig.event.dateDisplay}. Entrée à ${siteConfig.event.entryTime}.\nVotre table : ${table}.\n\nVoici votre invitation nominative. Merci de confirmer votre présence via ce lien :\n${invitationLink}`;
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}
export default async function GuestsPage({
  searchParams
}) {
  var _params$table;
  const access = await currentAdminAccess();
  if (!access.ok) return html(AdminGate, {
    access: access
  });
  const [tables, guests, responses, params, baseUrl] = await Promise.all([listTables(), listGuests(), listResponses(), searchParams, currentSiteBaseUrl()]);
  const responseByGuest = new Map(responses.filter(row => row.invitation_id).map(row => [row.invitation_id, row]));
  const editing = params.edit ? guests.find(guest => guest.id === params.edit) : undefined;
  const form = editing !== null && editing !== void 0 ? editing : {
    id: '',
    name: '',
    phone: '',
    party_size: 1,
    table_id: (_params$table = params.table) !== null && _params$table !== void 0 ? _params$table : '',
    token: '',
    created_at: '',
    table_name: ''
  };
  return html(Fragment, {
    children: [html(AdminHeader, {}), html("main", {
      className: "dashboard",
      children: [html(AdminTabs, {
        active: "guests"
      }), html("section", {
        className: "dashboard-intro",
        children: [html("div", {
          children: [html("p", {
            className: "brand",
            children: "Votre carnet d\u2019invit\xE9s"
          }), html("h1", {
            children: "Inviter, placer, partager."
          }), html("p", {
            className: "intro-copy",
            children: "Enregistrez les invit\xE9s, attribuez leur table et pr\xE9parez leur invitation WhatsApp."
          })]
        }), html("a", {
          className: "admin-button secondary",
          href: "/admin/tables",
          target: "_top",
          children: "G\xE9rer les tables"
        })]
      }), params.error ? html("p", {
        className: "alert error",
        role: "alert",
        children: params.error
      }) : null, params.notice ? html("p", {
        className: "alert success",
        role: "status",
        children: params.notice
      }) : null, html("div", {
        className: "management-columns",
        children: [html("section", {
          className: "management-panel",
          id: "new-guest",
          children: [html("h2", {
            children: form.id ? 'Modifier l’invité' : 'Ajouter un invité'
          }), html("form", {
            method: "post",
            action: "/api/admin/guests",
            target: "_top",
            className: "management-form",
            children: [html("input", {
              type: "hidden",
              name: "action",
              value: "guest"
            }), html("input", {
              type: "hidden",
              name: "id",
              value: form.id
            }), html("label", {
              children: ["Nom de l\u2019invit\xE9", html("input", {
                name: "name",
                required: true,
                maxLength: 100,
                defaultValue: form.name,
                autoComplete: "name"
              })]
            }), html("label", {
              children: ["Num\xE9ro WhatsApp (facultatif)", html("input", {
                type: "tel",
                name: "phone",
                maxLength: 30,
                placeholder: "+243 812 345 678",
                defaultValue: form.phone,
                autoComplete: "tel"
              })]
            }), html("label", {
              children: ["Nombre total de personnes", html("input", {
                type: "number",
                name: "party_size",
                min: 1,
                max: 20,
                required: true,
                defaultValue: form.party_size,
                inputMode: "numeric"
              })]
            }), html("label", {
              children: ["Table", html("select", {
                name: "table_id",
                required: true,
                defaultValue: form.table_id,
                children: [html("option", {
                  value: "",
                  children: "\xC0 attribuer"
                }), tables.map(table => html("option", {
                  value: table.id,
                  children: table.name
                }, table.id))]
              })]
            }), html("p", {
              className: "field-help",
              children: "Ce nombre inclut l\u2019invit\xE9 principal. Exemple : 4 signifie une invitation valable pour 4 personnes au total."
            }), html("button", {
              className: "admin-button primary",
              type: "submit",
              children: "Enregistrer l\u2019invit\xE9"
            }), form.id ? html("a", {
              href: "/admin/guests#new-guest",
              target: "_top",
              children: "Ajouter un autre invit\xE9"
            }) : null]
          })]
        }), html("section", {
          className: "management-panel",
          children: [html("h2", {
            children: "Ajouter une liste d\u2019invit\xE9s"
          }), html("form", {
            method: "post",
            action: "/api/admin/guests",
            target: "_top",
            className: "management-form",
            children: [html("input", {
              type: "hidden",
              name: "action",
              value: "bulk_guests"
            }), html("label", {
              children: ["Un invit\xE9 par ligne", html("textarea", {
                name: "guests",
                rows: 5,
                maxLength: 40000,
                required: true,
                placeholder: 'Marie Kabeya ; +243 812 345 678\nJean Mutombo ; +243 900 000 000'
              })]
            }), html("p", {
              className: "field-help",
              children: ["Format : ", html("strong", {
                children: "Nom ; Num\xE9ro"
              }), ". Un invit\xE9 par ligne. S\xE9lectionnez ensuite la table \xE0 affecter \xE0 tout ce groupe."]
            }), html("label", {
              children: ["Personnes par invitation", html("input", {
                type: "number",
                name: "party_size",
                min: 1,
                max: 20,
                required: true,
                defaultValue: 1,
                inputMode: "numeric"
              })]
            }), html("label", {
              children: ["Table du groupe", html("select", {
                name: "table_id",
                required: true,
                defaultValue: "",
                children: [html("option", {
                  value: "",
                  children: "\xC0 attribuer"
                }), tables.map(table => html("option", {
                  value: table.id,
                  children: table.name
                }, table.id))]
              })]
            }), html("button", {
              className: "admin-button secondary",
              type: "submit",
              children: "Enregistrer la liste"
            })]
          })]
        })]
      }), html("p", {
        className: "auto-url-note",
        children: "Les liens WhatsApp utilisent automatiquement l\u2019adresse publique du Site depuis lequel vous ouvrez cette administration."
      }), html("div", {
        className: "directory-heading",
        children: [html("h2", {
          children: [guests.length, " invit\xE9", guests.length !== 1 ? 's' : '', " enregistr\xE9", guests.length !== 1 ? 's' : '']
        }), html("label", {
          className: "search-field",
          hidden: true,
          "data-directory-search-label": true,
          children: [html("span", {
            className: "sr-only",
            children: "Rechercher un invit\xE9"
          }), html("input", {
            type: "search",
            id: "directorySearch",
            placeholder: "Nom, table, t\xE9l\xE9phone\u2026"
          })]
        })]
      }), html("p", {
        className: "field-help",
        children: "WhatsApp ouvre un message \xE0 v\xE9rifier puis \xE0 envoyer. L\u2019ouverture ne confirme pas l\u2019envoi ni la r\xE9ception."
      }), html("div", {
        className: "guests-directory",
        children: guests.map(guest => {
          var _guest$table_name, _reply$attending;
          const reply = responseByGuest.get(guest.id);
          const tableName = (_guest$table_name = guest.table_name) !== null && _guest$table_name !== void 0 ? _guest$table_name : '';
          const link = baseUrl && guest.token && tableName ? `${baseUrl}/?invitation=${encodeURIComponent(guest.token)}` : '';
          const whatsapp = whatsappUrl(guest.name, guest.phone, tableName, link);
          const status = (_reply$attending = reply === null || reply === void 0 ? void 0 : reply.attending) !== null && _reply$attending !== void 0 ? _reply$attending : 'pending';
          return html("details", {
            className: "management-panel guest-record",
            id: `guest-${guest.id}`,
            "data-guest-search": `${guest.name} ${guest.phone} ${tableName}`,
            children: [html("summary", {
              className: "guest-summary",
              children: [html("span", {
                className: "guest-summary-name",
                children: guest.name
              }), html("span", {
                className: "guest-summary-table",
                children: [tableName || 'Table à attribuer', " \xB7 ", guest.party_size, " personne", guest.party_size > 1 ? 's' : '']
              }), html("span", {
                className: `status ${status === 'yes' ? 'yes' : status === 'no' ? 'no' : 'pending'}`,
                children: status === 'yes' ? 'Présent' : status === 'no' ? 'Absent' : 'Sans réponse'
              }), html("span", {
                className: "accordion-hint",
                "aria-hidden": "true",
                children: "\uFF0B"
              })]
            }), html("div", {
              className: "guest-detail",
              children: [html("div", {
                className: "guest-record-head",
                children: html("div", {
                  children: [html("p", {
                    className: "brand",
                    children: "Invitation nominative"
                  }), html("h2", {
                    children: guest.name
                  }), html("p", {
                    className: "field-help",
                    children: [guest.phone || 'Numéro WhatsApp à renseigner', " \xB7 Invitation pour ", guest.party_size, " personne", guest.party_size > 1 ? 's' : '']
                  })]
                })
              }), html("form", {
                method: "post",
                action: "/api/admin/guests",
                target: "_top",
                className: "management-form assignment-form",
                children: [html("input", {
                  type: "hidden",
                  name: "action",
                  value: "assign"
                }), html("input", {
                  type: "hidden",
                  name: "id",
                  value: guest.id
                }), html("label", {
                  children: ["Table attribu\xE9e", html("select", {
                    name: "table_id",
                    defaultValue: guest.table_id,
                    children: tables.map(table => html("option", {
                      value: table.id,
                      children: table.name
                    }, table.id))
                  })]
                }), html("button", {
                  className: "admin-button secondary",
                  type: "submit",
                  children: "Enregistrer la table"
                })]
              }), html("div", {
                className: "record-actions",
                children: [html("a", {
                  className: "admin-button secondary",
                  href: `/admin/guests?edit=${encodeURIComponent(guest.id)}#new-guest`,
                  target: "_top",
                  children: "Modifier l\u2019invit\xE9"
                }), link ? html("a", {
                  className: "admin-button secondary",
                  href: link,
                  target: "_blank",
                  rel: "noopener noreferrer",
                  children: "Voir l\u2019invitation \u2197"
                }) : null, whatsapp ? html("a", {
                  className: "admin-button whatsapp-button",
                  href: whatsapp,
                  target: "_blank",
                  rel: "noopener noreferrer",
                  children: "Pr\xE9parer sur WhatsApp \u2197"
                }) : null, html("form", {
                  method: "post",
                  action: "/api/admin/guests",
                  target: "_top",
                  "data-confirm": "Supprimer d\xE9finitivement cet invit\xE9 et sa r\xE9ponse RSVP ?",
                  children: [html("input", {
                    type: "hidden",
                    name: "action",
                    value: "delete_guest"
                  }), html("input", {
                    type: "hidden",
                    name: "id",
                    value: guest.id
                  }), html("button", {
                    className: "admin-button danger",
                    type: "submit",
                    children: "Supprimer"
                  })]
                })]
              }), !tableName ? html("p", {
                className: "field-help",
                children: "Attribuez une table pour activer l\u2019invitation."
              }) : !guest.phone ? html("p", {
                className: "field-help",
                children: "Renseignez le num\xE9ro WhatsApp de l\u2019invit\xE9 pour pr\xE9parer le message."
              }) : null, reply ? html("details", {
                className: "management-details",
                children: [html("summary", {
                  children: "Voir les informations envoy\xE9es par l\u2019invit\xE9"
                }), html("dl", {
                  className: "response-details",
                  children: [html("dt", {
                    children: "Nom communiqu\xE9"
                  }), html("dd", {
                    children: reply.full_name
                  }), html("dt", {
                    children: "T\xE9l\xE9phone"
                  }), html("dd", {
                    children: reply.phone
                  }), html("dt", { children: "Num\u00e9ro de secours" }), html("dd", { children: reply.backup_phone || 'Non renseign\u00e9' }), html("dt", {
                    children: "E-mail"
                  }), html("dd", {
                    children: reply.email
                  }), html("dt", {
                    children: "Pr\xE9f\xE9rence de boisson"
                  }), html("dd", {
                    children: reply.drink_preference || 'Non précisée'
                  }), html("dt", {
                    children: "Chanson propos\xE9e"
                  }), html("dd", {
                    children: reply.song_suggestion || '—'
                  }), html("dt", {
                    children: "Message"
                  }), html("dd", {
                    children: reply.message
                  }), html("dt", {
                    children: "Derni\xE8re r\xE9ponse"
                  }), html("dd", {
                    children: reply.updated_at
                  })]
                })]
              }) : null]
            })]
          }, guest.id);
        })
      }), html("p", {
        id: "directoryCount",
        className: "field-help",
        role: "status",
        "aria-live": "polite"
      }), !guests.length ? html("div", {
        className: "empty-state",
        children: [html("h3", {
          children: "Votre liste est pr\xEAte \xE0 \xEAtre remplie."
        }), html("p", {
          children: "Ajoutez un invit\xE9 ou collez votre liste dans les formulaires ci-dessus."
        })]
      }) : null, html(AdminFooter, {})]
    }), html(RuntimeScript, {
      src: "/assets/js/guestbook.js"
    })]
  });
}
