// HTML généré par des fonctions JavaScript natives ; aucune dépendance React.
import { html, Fragment } from '../html.js';
import { AdminFooter, AdminGate, AdminHeader, AdminTabs } from './admin-ui.js';
import { currentAdminAccess } from '../auth.js';
import { listGuests, listResponses, listTables } from '../guestbook.js';
import { siteConfig } from '../../site-config.js';
import { RuntimeScript } from '../html.js';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
function responseRanking(entries, splitItems = false) {
  const ranking = new Map();
  for (const entry of entries) {
    const items = splitItems ? entry.value.split(/[,;\/\n]+/u) : [entry.value];
    const seenInResponse = new Set();
    for (const rawItem of items) {
      const label = rawItem.trim().replace(/\s+/gu, ' ');
      if (!label) continue;
      const key = label.normalize('NFD').replace(/[\u0300-\u036f]/gu, '').toLocaleLowerCase('fr');
      if (seenInResponse.has(key)) continue;
      seenInResponse.add(key);
      const current = ranking.get(key);
      if (current) {
        current.count += 1;
        current.guests.push({
          name: entry.name,
          table: entry.table
        });
      } else {
        ranking.set(key, {
          label,
          count: 1,
          guests: [{
            name: entry.name,
            table: entry.table
          }]
        });
      }
    }
  }
  return [...ranking.values()].sort((a, b) => b.count - a.count || a.label.localeCompare(b.label, 'fr'));
}
export default async function AdminDashboard({
  searchParams
}) {
  const access = await currentAdminAccess();
  if (!access.ok) return html(AdminGate, {
    access: access
  });
  const [rows, guests, tables, params] = await Promise.all([listResponses(), listGuests(), listTables(), searchParams]);
  const responseByGuest = new Map(rows.filter(row => row.invitation_id).map(row => [row.invitation_id, row]));
  const yes = rows.filter(row => row.attending === 'yes');
  const no = rows.filter(row => row.attending === 'no');
  const guestById = new Map(guests.map(guest => [guest.id, guest]));
  const totalInvitedPeople = guests.reduce((total, guest) => total + Number(guest.party_size || 1), 0);
  const totalPeople = yes.reduce((total, row) => {
    var _guestById$get;
    return total + (row.invitation_id ? Number(((_guestById$get = guestById.get(row.invitation_id)) === null || _guestById$get === void 0 ? void 0 : _guestById$get.party_size) || 1) : 1);
  }, 0);
  const pending = guests.filter(guest => !responseByGuest.has(guest.id)).length;
  const unassigned = guests.filter(guest => !guest.table_name).length;
  const drinkRanking = responseRanking(yes.map(row => ({
    value: row.drink_preference,
    name: row.full_name,
    table: row.table_name
  })), true);
  const songRanking = responseRanking(rows.map(row => ({
    value: row.song_suggestion,
    name: row.full_name,
    table: row.table_name
  })));
  return html(Fragment, {
    children: [html(AdminHeader, {}), html("main", {
      className: "dashboard",
      children: [html(AdminTabs, {
        active: "index"
      }), html("section", {
        className: "dashboard-intro",
        "aria-labelledby": "dashboard-title",
        children: [html("div", {
          children: [html("h1", {
            id: "dashboard-title",
            children: "Pr\xE9parons le grand jour."
          }), html("p", {
            className: "intro-copy",
            children: "Retrouvez les r\xE9ponses de vos invit\xE9s et pr\xE9parez leur accueil."
          })]
        }), html("a", {
          className: "admin-button primary",
          href: "/admin/guests#new-guest",
          target: "_top",
          children: [html("span", {
            "aria-hidden": "true",
            children: "\uFF0B"
          }), " Enregistrer un invit\xE9"]
        })]
      }), html("section", {
        className: "event-strip",
        "aria-label": "Votre \xE9v\xE9nement",
        children: [html("div", {
          children: [html("span", {
            className: "event-indicator",
            "aria-hidden": "true"
          }), html("strong", {
            children: siteConfig.couple.names
          })]
        }), html("p", {
          children: [siteConfig.event.dateDisplay, html("span", {
            "aria-hidden": "true",
            children: " \xB7 "
          }), "Entr\xE9e \xE0 ", siteConfig.event.entryTime]
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
        className: "stats",
        "aria-label": "Statistiques des r\xE9ponses",
        children: [html("article", {
          className: "stat-confirmed",
          children: [html("span", {
            children: "Pr\xE9sences confirm\xE9es"
          }), html("strong", {
            children: yes.length
          }), html("small", {
            children: "R\xE9ponses positives re\xE7ues"
          })]
        }), html("article", {
          className: "stat-people",
          children: [html("span", {
            children: "Personnes attendues"
          }), html("strong", {
            children: totalPeople
          }), html("small", {
            children: "Invit\xE9s pr\xE9sents confirm\xE9s"
          })]
        }), html("article", {
          children: [html("span", {
            children: "Absences annonc\xE9es"
          }), html("strong", {
            children: no.length
          }), html("small", {
            children: "R\xE9ponses n\xE9gatives re\xE7ues"
          })]
        }), html("article", {
          children: [html("span", {
            children: "Total des r\xE9ponses"
          }), html("strong", {
            children: rows.length
          }), html("small", {
            children: "Toutes les confirmations RSVP"
          })]
        })]
      }), html("section", {
        className: "stats preparation-stats",
        "aria-label": "Pr\xE9paration des invitations",
        children: [html("article", {
          children: [html("span", {
            children: "Invitations cr\xE9\xE9es"
          }), html("strong", {
            children: guests.length
          }), html("small", {
            children: html("a", {
              href: "/admin/guests",
              target: "_top",
              children: "Ouvrir le carnet d\u2019invit\xE9s \u2192"
            })
          })]
        }), html("article", {
          className: "stat-invited",
          children: [html("span", {
            children: "Personnes invit\xE9es"
          }), html("strong", {
            children: totalInvitedPeople
          }), html("small", {
            children: "Capacit\xE9 totale de toutes les invitations"
          })]
        }), html("article", {
          children: [html("span", {
            children: "Sans r\xE9ponse"
          }), html("strong", {
            children: pending
          }), html("small", {
            children: "Parmi les invit\xE9s enregistr\xE9s"
          })]
        }), html("article", {
          children: [html("span", {
            children: "Tables enregistr\xE9es"
          }), html("strong", {
            children: tables.length
          }), html("small", {
            children: html("a", {
              href: "/admin/tables",
              target: "_top",
              children: "Consulter le plan de salle \u2192"
            })
          })]
        }), html("article", {
          children: [html("span", {
            children: "Sans table attribu\xE9e"
          }), html("strong", {
            children: unassigned
          }), html("small", {
            children: "Invit\xE9s \xE0 placer avant le partage"
          })]
        })]
      }), html("section", {
        className: "request-rankings",
        "aria-label": "Pr\xE9f\xE9rences des invit\xE9s",
        children: [html("article", {
          className: "ranking-card",
          children: [html("div", {
            className: "ranking-head",
            children: [html("div", {
              children: [html("p", {
                className: "brand",
                children: "Pr\xE9paration du service"
              }), html("h2", {
                children: "Boissons les plus demand\xE9es"
              })]
            }), html("span", {
              children: [drinkRanking.reduce((total, item) => total + item.count, 0), " demande(s)"]
            })]
          }), drinkRanking.length ? html("ol", {
            className: "ranking-list",
            children: drinkRanking.map((item, index) => html("li", {
              children: html("details", {
                className: "ranking-details",
                children: [html("summary", {
                  className: "ranking-row",
                  children: [html("span", {
                    className: "ranking-position",
                    children: index + 1
                  }), html("strong", {
                    children: item.label
                  }), html("b", {
                    children: item.count
                  }), html("span", {
                    className: "ranking-toggle",
                    "aria-hidden": "true",
                    children: "\uFF0B"
                  })]
                }), html("ul", {
                  className: "ranking-guests",
                  children: item.guests.map((guest, guestIndex) => html("li", {
                    children: [html("span", {
                      children: guest.name
                    }), html("small", {
                      children: guest.table || 'Table non attribuée'
                    })]
                  }, `${guest.name}-${guest.table}-${guestIndex}`))
                })]
              })
            }, item.label))
          }) : html("p", {
            className: "ranking-empty",
            children: "Aucune pr\xE9f\xE9rence de boisson enregistr\xE9e."
          })]
        }), html("article", {
          className: "ranking-card",
          children: [html("div", {
            className: "ranking-head",
            children: [html("div", {
              children: [html("p", {
                className: "brand",
                children: "Pr\xE9paration de la playlist"
              }), html("h2", {
                children: "Chansons les plus propos\xE9es"
              })]
            }), html("span", {
              children: [songRanking.reduce((total, item) => total + item.count, 0), " recommandation(s)"]
            })]
          }), songRanking.length ? html("ol", {
            className: "ranking-list",
            children: songRanking.map((item, index) => html("li", {
              children: html("details", {
                className: "ranking-details",
                children: [html("summary", {
                  className: "ranking-row",
                  children: [html("span", {
                    className: "ranking-position",
                    children: index + 1
                  }), html("strong", {
                    children: item.label
                  }), html("b", {
                    children: item.count
                  }), html("span", {
                    className: "ranking-toggle",
                    "aria-hidden": "true",
                    children: "\uFF0B"
                  })]
                }), html("ul", {
                  className: "ranking-guests",
                  children: item.guests.map((guest, guestIndex) => html("li", {
                    children: [html("span", {
                      children: guest.name
                    }), html("small", {
                      children: guest.table || 'Table non attribuée'
                    })]
                  }, `${guest.name}-${guest.table}-${guestIndex}`))
                })]
              })
            }, item.label))
          }) : html("p", {
            className: "ranking-empty",
            children: "Aucune chanson propos\xE9e pour le moment."
          })]
        })]
      }), html("section", {
        className: "table-card",
        "aria-labelledby": "responses-title",
        children: [html("div", {
          className: "table-head",
          children: [html("div", {
            children: [html("p", {
              className: "brand",
              children: "Votre liste d\u2019invit\xE9s"
            }), html("h2", {
              id: "responses-title",
              children: "Les r\xE9ponses re\xE7ues"
            })]
          }), html("a", {
            className: "admin-button secondary",
            href: "/api/admin/export",
            children: ["Exporter en CSV ", html("span", {
              "aria-hidden": "true",
              children: "\u2193"
            })]
          })]
        }), html("div", {
          className: "table-toolbar",
          hidden: true,
          id: "tableToolbar",
          children: [html("div", {
            className: "filter-group",
            role: "group",
            "aria-label": "Filtrer les r\xE9ponses",
            children: [html("button", {
              type: "button",
              "data-filter": "all",
              "aria-pressed": "true",
              children: ["Toutes ", html("span", {
                children: rows.length
              })]
            }), html("button", {
              type: "button",
              "data-filter": "yes",
              "aria-pressed": "false",
              children: ["Pr\xE9sents ", html("span", {
                children: yes.length
              })]
            }), html("button", {
              type: "button",
              "data-filter": "no",
              "aria-pressed": "false",
              children: ["Absents ", html("span", {
                children: no.length
              })]
            })]
          }), html("label", {
            className: "search-field",
            children: [html("span", {
              className: "sr-only",
              children: "Rechercher un invit\xE9, une table ou un contact"
            }), html("input", {
              id: "search",
              type: "search",
              placeholder: "Nom, table, t\xE9l\xE9phone\u2026",
              autoComplete: "off"
            })]
          })]
        }), html("div", {
          className: "responses-directory",
          id: "rsvpResponses",
          children: rows.map(row => html("details", {
            className: "response-record",
            "data-attending": row.attending,
            children: [html("summary", {
              className: "response-summary",
              children: [html("span", {
                className: "response-summary-name",
                children: row.full_name
              }), html("span", {
                className: "response-summary-table",
                children: row.table_name || 'Table non attribuée'
              }), html("span", {
                className: `status ${row.attending}`,
                children: row.attending === 'yes' ? 'Présent' : 'Absent'
              }), html("span", {
                className: "accordion-hint",
                "aria-hidden": "true",
                children: "\uFF0B"
              })]
            }), html("div", {
              className: "response-detail",
              children: [html("dl", {
                className: "response-details",
                children: [html("dt", {
                  children: "Nom complet"
                }), html("dd", {
                  children: row.full_name
                }), html("dt", {
                  children: "Table"
                }), html("dd", {
                  children: row.table_name || 'Non attribuée'
                }), html("dt", {
                  children: "R\xE9ponse"
                }), html("dd", {
                  children: row.attending === 'yes' ? 'Présent(e)' : 'Absent(e)'
                }), html("dt", {
                  children: "T\xE9l\xE9phone"
                }), html("dd", {
                  children: row.phone || 'Non renseigné'
                }), html("dt", { children: "Num\u00e9ro de secours" }), html("dd", { children: row.backup_phone || 'Non renseign\u00e9' }), html("dt", {
                  children: "E-mail"
                }), html("dd", {
                  children: row.email || 'Non renseigné'
                }), html("dt", {
                  children: "Pr\xE9f\xE9rence de boisson"
                }), html("dd", {
                  children: row.drink_preference || 'Non précisée'
                }), html("dt", {
                  children: "Chanson propos\xE9e"
                }), html("dd", {
                  children: row.song_suggestion || 'Aucune proposition'
                }), html("dt", {
                  children: "Message ou pr\xE9cision"
                }), html("dd", {
                  children: row.message || 'Aucun message'
                }), html("dt", {
                  children: "Derni\xE8re mise \xE0 jour"
                }), html("dd", {
                  children: new Intl.DateTimeFormat('fr-FR', {
                    dateStyle: 'long',
                    timeStyle: 'short',
                    timeZone: siteConfig.timezone
                  }).format(new Date(row.updated_at))
                })]
              }), html("form", {
                className: "response-actions",
                method: "post",
                action: "/api/admin/responses",
                target: "_top",
                children: [html("input", {
                  type: "hidden",
                  name: "id",
                  value: row.id
                }), html("button", {
                  className: "admin-button danger compact-action",
                  type: "submit",
                  children: "Supprimer cette r\xE9ponse"
                })]
              })]
            })]
          }, row.id))
        }), !rows.length ? html("div", {
          className: "empty-state",
          children: [html("span", {
            className: "empty-symbol",
            "aria-hidden": "true",
            children: "\u2709"
          }), html("h3", {
            children: "Les premi\xE8res r\xE9ponses arrivent bient\xF4t."
          }), html("p", {
            children: "Ajoutez un invit\xE9 puis partagez son lien nominatif."
          }), html("a", {
            className: "admin-button secondary",
            href: "/admin/guests#new-guest",
            target: "_top",
            children: "Ajouter un invit\xE9"
          })]
        }) : null, html("div", {
          className: "empty-state",
          id: "noResults",
          hidden: true,
          children: [html("h3", {
            children: "Aucune r\xE9ponse ne correspond."
          }), html("p", {
            children: "Essayez un autre nom ou affichez toutes les r\xE9ponses."
          }), html("button", {
            className: "admin-button secondary",
            type: "button",
            id: "resetFilters",
            children: "R\xE9initialiser les filtres"
          })]
        }), html("div", {
          className: "table-footer",
          children: [html("p", {
            id: "resultCount",
            role: "status",
            "aria-live": "polite",
            children: [rows.length, " r\xE9ponse", rows.length !== 1 ? 's' : '']
          }), html("span", {
            children: "Les r\xE9ponses les plus r\xE9centes apparaissent en premier."
          })]
        })]
      }), html(AdminFooter, {})]
    }), html(RuntimeScript, {
      src: "/assets/js/admin.js"
    })]
  });
}
