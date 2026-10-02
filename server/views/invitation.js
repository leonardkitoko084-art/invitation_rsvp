// HTML généré par des fonctions JavaScript natives ; aucune dépendance React.
import { html, Fragment } from '../html.js';
import { getInvitationByToken } from '../guestbook.js';
import { siteConfig } from '../../site-config.js';
import { currentSiteBaseUrl } from '../site-url.js';
import { RuntimeScript } from '../html.js';
import { googleCalendarLink } from '../calendar-links.js';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
function Icon({
  name,
  className = ''
}) {
  var _paths$name;
  const paths = {
    pin: ['M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0Z', 'M15 10a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z'],
    users: ['M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2', 'M13 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z', 'M20 21v-2a4 4 0 0 0-3-3.9', 'M17 3.1a4 4 0 0 1 0 7.8'],
    church: ['M12 2v6M9 5h6', 'm3 12 9-6 9 6v10H3Z', 'M9 22v-6a3 3 0 0 1 6 0v6'],
    music: ['M9 18V5l12-2v13', 'M9 18a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z', 'M21 16a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z'],
    calendar: ['M8 2v4M16 2v4M3 10h18', 'M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z', 'M8 14h3M8 18h6'],
    disc: ['M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0Z', 'M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z', 'M6 12a6 6 0 0 1 6-6M18 12a6 6 0 0 1-6 6'],
    gift: ['M3 8h18v4H3Z', 'M5 12v9h14v-9M12 8v13', 'M12 8H8a3 3 0 1 1 3-3l1 3Z', 'M12 8h4a3 3 0 1 0-3-3l-1 3Z'],
    plate: ['M19 12a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z', 'M1 3v7M3 3v7M1 7h2M2 10v11M22 3v18M22 3c-3 3-3 8 0 8'],
    shirt: ['m16 3 6 4-3 5-3-2v12H8V10l-3 2-3-5 6-4a4 4 0 0 0 8 0Z']
  };
  return html("svg", {
    className: className,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.35,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": "true",
    children: ((_paths$name = paths[name]) !== null && _paths$name !== void 0 ? _paths$name : paths.calendar).map((d, i) => html("path", {
      d: d
    }, i))
  });
}
export default async function InvitationPage({
  searchParams
}) {
  var _rawToken$, _invitation$name, _invitation$table, _invitation$phone;
  const params = await searchParams;
  const rawToken = params.invitation;
  const invitationToken = Array.isArray(rawToken) ? (_rawToken$ = rawToken[0]) !== null && _rawToken$ !== void 0 ? _rawToken$ : '' : rawToken !== null && rawToken !== void 0 ? rawToken : '';
  const invitation = await getInvitationByToken(invitationToken);
  const invitee = (_invitation$name = invitation === null || invitation === void 0 ? void 0 : invitation.name) !== null && _invitation$name !== void 0 ? _invitation$name : '';
  const tableName = (_invitation$table = invitation === null || invitation === void 0 ? void 0 : invitation.table) !== null && _invitation$table !== void 0 ? _invitation$table : '';
  const invalidInvitation = !invitation && Boolean(params.invitation || params.invitee || params.table);
  const baseUrl = invitation ? await currentSiteBaseUrl() : '';
  const link = invitation && baseUrl ? `${baseUrl}/?invitation=${encodeURIComponent(invitationToken)}` : '';
  const qrUrl = link ? `https://api.qrserver.com/v1/create-qr-code/?size=360x360&data=${encodeURIComponent(link)}` : '';
  return html(Fragment, {
    children: [html("main", {
      className: "invitation-sheet",
      id: "top",
      children: [html("section", {
        className: "cover cover-home",
        "aria-label": "Invitation de mariage",
        children: [html("h1", {
          className: "sr-only",
          children: ["Mariage de ", siteConfig.couple.names, " \u2014 ", siteConfig.event.dateLong]
        }), html("img", {
          className: "cover-source",
          src: "/photos/Home.png",
          alt: "Mariage religieux — Invitation de Grace et Esther, portrait du couple avec le bouquet.",
          width: 1024,
          height: 1240,
          fetchPriority: "high"
        })]
      }), html("div", {
        className: "invitation-paper",
        children: [html("section", {
          className: "invitation-intro paper-section",
          id: "invitation",
          children: html("div", {
            className: "paper-content",
            children: [html("div", {
              className: "monograms",
              "aria-hidden": "true",
              children: [html("span", {
                children: [html("b", {
                  children: "G"
                }), html("small", {
                  children: "GRACE"
                })]
              }), html("i", {}), html("span", {
                children: [html("b", {
                  children: "E"
                }), html("small", {
                  children: "ESTHER"
                })]
              })]
            }), html("p", {
              className: "couple-caption",
              children: siteConfig.couple.heroNames
            }), html("blockquote", {
              children: ["\xAB Ainsi, ils ne sont plus deux, mais une seule chair.", html("br", {}), "Que l\u2019homme donc ne s\xE9pare pas ce que Dieu a uni. \xBB", html("cite", {
                children: "Matthieu 19 : 6"
              })]
            }), invitation ? html("div", {
              className: "guest-invitation",
              children: [html("p", {
                className: "guest-salutation",
                children: "M., Mme, Mlle, Couple"
              }), html("h2", {
                className: "guest-name",
                children: invitee
              }), html("p", {
                className: "guest-table",
                children: [html("span", {
                  children: "VOTRE TABLE :"
                }), html("strong", {
                  children: tableName
                })]
              }), html("p", {
                className: "party-size",
                children: ["Invitation valable pour ", invitation.partySize, " personne", invitation.partySize > 1 ? 's' : '', "."]
              })]
            }) : invalidInvitation ? html("p", {
              className: "invalid-invitation",
              role: "alert",
              children: "Cette invitation ne peut pas \xEAtre v\xE9rifi\xE9e. Demandez votre lien nominatif aux organisateurs."
            }) : null, html("h2", {
              className: "script invited-heading",
              children: "Vous \xEAtes invit\xE9(s)"
            }), html("p", {
              className: "invitation-paragraph",
              children: ["Parce que l\u2019amour nous a r\xE9unis,", html("br", {}), "parce que le temps a confirm\xE9 notre choix,", html("br", {}), "nous avons d\xE9cid\xE9 de nous unir pour la vie."]
            }), html("p", {
              className: "invitation-paragraph",
              children: ["C\u2019est avec beaucoup de joie et d\u2019\xE9motion que, ensemble", html("br", {
                className: "wide-break"
              }), " avec les familles", html("br", {}), html("strong", {
                children: siteConfig.entourage[0].names.join(' & ')
              })]
            }), html("p", {
              className: "invitation-paragraph",
              children: ["Avons l\u2019honneur de vous convier \xE0 la c\xE9l\xE9bration de notre mariage.", html("br", {}), "Nous aimerions partager avec vous un moment de bonheur et de gaiet\xE9 \xE0 cette occasion sp\xE9ciale."]
            }), html("div", {
              className: "couple-seal",
              children: [html("span", {
                className: "seal-line seal-one",
                "aria-hidden": "true"
              }), html("span", {
                className: "seal-line seal-two",
                "aria-hidden": "true"
              }), html("div", {
                className: "script",
                children: [siteConfig.couple.firstNames[0], html("span", {
                  className: "seal-surname",
                  children: siteConfig.couple.familyNames[0]
                }), html("small", {
                  children: "et"
                }), siteConfig.couple.firstNames[1], html("span", {
                  className: "seal-surname",
                  children: siteConfig.couple.familyNames[1]
                })]
              })]
            }), html("div", {
              className: "date-card",
              "aria-label": siteConfig.event.dateLong,
              children: [html("span", {
                className: "date-month",
                children: siteConfig.event.month
              }), html("div", {
                className: "date-row",
                children: [html("span", {
                  children: siteConfig.event.weekday
                }), html("strong", {
                  children: siteConfig.event.day
                }), html("span", {
                  children: siteConfig.event.arrivalTime
                })]
              }), html("span", {
                className: "date-year",
                children: siteConfig.event.year
              })]
            })]
          })
        }), html("section", {
          className: "program-section paper-section",
          id: "program",
          children: html("div", {
            className: "paper-content",
            children: [html("h2", {
              className: "gold-heading",
              children: "Programme"
            }), ...[
              { phase: 'ceremony', venue: siteConfig.venues[0], title: 'Bénédiction nuptiale' },
              { phase: 'reception', venue: siteConfig.venues[1], title: 'Soirée dansante' }
            ].map(({phase, venue, title}) => html("section", {
              className: 'program-group program-group-' + phase,
              "aria-labelledby": 'program-' + phase + '-title',
              children: [html("h3", {
                id: 'program-' + phase + '-title',
                className: "program-group-title",
                children: title
              }), html("p", {
                className: "program-venue",
                children: [html("strong", { children: phase === 'reception' ? 'Salle ' + venue.name : venue.name }),
                  venue.extension ? [html("br", {}), venue.extension] : null,
                  html("br", {}), venue.address]
              }), html("a", {
                className: "subtle-link",
                href: venue.mapUrl,
                target: "_blank",
                rel: "noopener noreferrer",
                children: phase === 'ceremony' ? 'Voir l’itinéraire de l’église' : 'Voir l’itinéraire de la salle'
              }), html("div", {
                className: "program-list",
                children: siteConfig.schedule.filter(item => item.phase === phase).map(item => html("article", {
                  className: "program-item",
                  children: [html(Icon, { name: item.icon }), html("div", {
                    children: [html("time", { children: item.time }), html("h4", { children: item.title })]
                  })]
                }))
              })]
            }))]

          })
        }), html("section", {
          className: "dress-section paper-section",
          id: "details",
          children: [html("div", {
            className: "paper-content",
            children: [html("h2", {
              className: "script theme-label",
              children: "Th\xE8me de la salle"
            }), html("p", {
              className: "script theme-title",
              children: siteConfig.roomTheme.title
            }), html("div", {
              className: "dress-guide",
              children: [html("div", {
                className: "wedding-attire-icons",
                children: [html("img", { src: "/assets/icons/robe-de-mariee.png", alt: "Robe de mariée", width: 512, height: 512, loading: "lazy" }),
                  html("img", { src: "/assets/icons/costume.png", alt: "Costume", width: 512, height: 512, loading: "lazy" })]
              }), html("span", { children: ["Guide", html("br", {}), "vestimentaire"] })]
            }), html("h3", {
              className: "dress-heading",
              children: "DRESS CODE"
            }), html("p", {
              className: "dress-description",
              children: siteConfig.dressCode.description
            }), html("div", {
              className: "swatches",
              "aria-label": "Couleurs vestimentaires : rouge bordeaux, bleu de nuit ou noir",
              children: siteConfig.dressCode.colors.map(swatch => html("figure", {
                children: [html("span", {
                  style: {
                    backgroundColor: swatch.color
                  },
                  "aria-hidden": "true"
                }), html("figcaption", {
                  children: swatch.name
                })]
              }, swatch.name))
            }), html("p", {
              className: "script welcome-signature",
              children: "Cordiale Bienvenue"
            })]
          }), html("figure", {
            className: "photo-trio",
            "aria-label": "Les trois portraits du couple en studio",
            children: [html("img", {
              src: "/photos/couple-face-a-face.png",
              alt: "Le couple face \xE0 face.",
              width: 1024,
              height: 1536,
              loading: "lazy"
            }), html("img", {
              src: "/photos/couple-bouquet.png",
              alt: "Le couple avec le bouquet.",
              width: 1024,
              height: 1536,
              loading: "lazy"
            }), html("img", {
              src: "/photos/couple-complice.png",
              alt: "Le couple dans une pose complice.",
              width: 1536,
              height: 1024,
              loading: "lazy"
            })]
          })]
        }), invitation && qrUrl ? html("section", {
          className: "qr-section paper-section",
          id: "qr-entree",
          children: [html("h2", {
            className: "gold-heading",
            children: "Votre QR code"
          }), html("p", {
            children: "\xC0 pr\xE9senter \xE0 l\u2019accueil."
          }), html("img", {
            src: qrUrl,
            alt: `QR code d’entrée de ${invitee}`,
            width: 280,
            height: 280,
            loading: "lazy"
          }), html("p", {
            children: [html("strong", {
              children: invitee
            }), html("br", {}), "Table : ", tableName, html("br", {}), invitation.partySize, " personne", invitation.partySize > 1 ? 's' : '']
          }), html("small", {
            children: "Ce QR code est personnel."
          })]
        }) : null, html("section", {
          className: "rsvp-section paper-section",
          id: "rsvp",
          children: html("div", {
            className: "paper-content rsvp-card",
            children: [html("p", { className: "rsvp-eyebrow", children: "Une place pour vous" }), html("div", { className: "rsvp-emblem", "aria-hidden": "true", children: html(Icon, { name: "plate" }) }), html("h2", {
              className: "gold-heading",
              children: "Confirmer ma pr\xE9sence"
            }), html("p", {
              className: "rsvp-intro",
              children: ["Merci de nous indiquer si vous serez des n\xF4tres, au plus tard le ", siteConfig.event.rsvpDeadline, "."]
            }), html("form", {
              className: "rsvp-form",
              id: "rsvpForm",
              method: "post",
              action: "/api/rsvp",
              noValidate: true,
              children: [html("p", { className: "form-section-title", children: [html("span", { children: "01" }), " Vos coordonnées"] }), html("p", { className: "form-help", children: "Les champs marqués d’un * sont obligatoires." }), html("input", {
                type: "hidden",
                name: "invitation",
                value: invitation ? invitationToken : ''
              }), html("input", {
                type: "hidden",
                name: "loaded_at",
                value: String(Date.now())
              }), html("div", {
                className: "honeypot",
                "aria-hidden": "true",
                children: html("label", {
                  children: ["Votre site", html("input", {
                    type: "text",
                    name: "website",
                    tabIndex: -1,
                    autoComplete: "off"
                  })]
                })
              }), html("label", {
                children: ["Nom complet *", html("input", {
                  required: true,
                  minLength: 2,
                  maxLength: 100,
                  name: "full_name",
                  autoComplete: "name",
                  placeholder: "Votre nom et pr\xE9nom",
                  defaultValue: invitee,
                  readOnly: Boolean(invitation)
                })]
              }), tableName ? html("p", {
                className: "form-table",
                children: ["Votre table : ", html("strong", {
                  children: tableName
                })]
              }) : null, html("details", {
                className: "backup-phone-option",
                children: [html("summary", { children: "Ajouter un num\u00e9ro de secours (facultatif)" }), html("label", { children: ["Num\u00e9ro de secours", html("input", { name: "backup_phone", type: "tel", inputMode: "tel", autoComplete: "tel", maxLength: 30, minLength: 6, placeholder: "+243 812 345 678" })] })]
              }), html("p", { className: "form-section-title", children: [html("span", { children: "02" }), " Votre présence"] }), html("fieldset", {
                children: [html("legend", {
                  children: "Serez-vous pr\xE9sent(e) ? *"
                }), html("div", {
                  className: "choice-row",
                  children: [html("label", {
                    className: "choice",
                    children: [html("input", {
                      required: true,
                      type: "radio",
                      name: "attending",
                      value: "yes"
                    }), html("span", {
                      children: "Oui, avec plaisir"
                    })]
                  }), html("label", {
                    className: "choice",
                    children: [html("input", {
                      required: true,
                      type: "radio",
                      name: "attending",
                      value: "no"
                    }), html("span", {
                      children: "Non, malheureusement"
                    })]
                  })]
                })]
              }), html("div", {
                className: "attendance-extra-fields",
                hidden: true,
                children: [html("label", {
                  children: ["Pr\xE9f\xE9rence de boisson *", html("textarea", {
                    name: "drink_preference",
                    maxLength: 120,
                    rows: 2,
                    placeholder: "Jus naturel, eau, vin rouge\u2026"
                  })]
                })]
              }), html("input", { type: "hidden", name: "consent", value: "1" }), html("p", {
                className: "form-privacy-note",
                children: ["En envoyant votre r\u00e9ponse, vous acceptez l\u2019utilisation de votre nom, num\u00e9ro et pr\u00e9f\u00e9rence de boisson pour organiser le mariage. ", html("a", { href: "/privacy", children: "Confidentialit\u00e9" })]
              }), html("button", {
                className: "button button-primary submit-button",
                type: "submit",
                children: "Envoyer ma r\xE9ponse"
              }), html("p", {
                className: "form-status",
                id: "formStatus",
                role: "status",
                "aria-live": "polite"
              })]
            }), html("p", { className: "rsvp-assurance", children: "Votre réponse nous aide à préparer votre accueil avec attention." }), html("a", {
              className: "calendar-link",
              href: googleCalendarLink('reception'),
              target: "_blank",
              rel: "noopener noreferrer",
              children: "Ajouter la soirée à Google Agenda"
            }), html("a", {
              className: "calendar-link",
              href: googleCalendarLink('ceremony'),
              target: "_blank",
              rel: "noopener noreferrer",
              children: "Ajouter la cérémonie à Google Agenda"
            })]
          })
        }), html("footer", {
          className: "footer",
          children: [html("p", {
            className: "script",
            children: siteConfig.couple.heroNames
          }), html("p", {
            children: siteConfig.event.dateLong
          }), html("div", {
            className: "footer-actions",
            children: [html("a", {
              href: "#top",
              children: "Retour en haut"
            }), html("a", {
              href: "/privacy",
              children: "Confidentialit\xE9"
            }), html("a", {
              href: "/admin",
              target: "_top",
              children: "Espace organisateur"
            })]
          }), html("small", {
            children: ["Invitation digitale con\xE7ue par ", html("a", {
              href: "https://www.leodesign.tech",
              target: "_blank",
              rel: "noopener noreferrer",
              children: "LEO DESIGN"
            })]
          })]
        })]
      })]
    }), html("a", {
      className: "floating-rsvp",
      href: "#rsvp",
      children: "RSVP"
    }), html("div", {
      className: "success-modal",
      id: "successModal",
      hidden: true,
      children: html("div", {
        className: "modal-card",
        role: "dialog",
        "aria-modal": "true",
        "aria-describedby": "successMessage",
        "aria-labelledby": "successTitle",
        children: [html("div", { className: "success-icon", "aria-hidden": "true", children: "✓" }), html("p", { className: "rsvp-eyebrow", children: "Merci pour votre réponse" }), html("h2", {
          id: "successTitle",
          children: "R\xE9ponse enregistr\xE9e"
        }), html("p", {
          id: "successMessage"
        }), html("button", {
          type: "button",
          className: "button button-primary",
          "data-close-modal": true,
          children: "Fermer"
        })]
      })
    }), html(RuntimeScript, {
      src: "/assets/js/app.js"
    })]
  });
}
