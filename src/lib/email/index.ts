import { Resend } from "resend";

let _resend: Resend | null = null;

export function getResend(): Resend {
  if (!_resend) {
    const key = process.env.RESEND_API_KEY;
    if (!key) {
      throw new Error("RESEND_API_KEY is not set. Configure your .env.local file.");
    }
    _resend = new Resend(key);
  }
  return _resend;
}

const FROM_EMAIL = process.env.RESEND_FROM_EMAIL ?? "ComptaFlow <noreply@comptaflow.fr>";

// Email pour echeance qui arrive bientot (J-7)
export async function sendDeadlineReminder(opts: {
  to: string;
  clientName: string;
  deadlineTitle: string;
  deadlineType: string;
  dueDate: string;
  daysLeft: number;
}) {
  const resend = getResend();
  return resend.emails.send({
    from: FROM_EMAIL,
    to: opts.to,
    subject: `[ComptaFlow] Echeance dans ${opts.daysLeft} jour(s) : ${opts.deadlineTitle}`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #18181b; color: white; padding: 20px; border-radius: 8px 8px 0 0;">
          <h1 style="margin: 0; font-size: 20px;">ComptaFlow</h1>
        </div>
        <div style="padding: 24px; border: 1px solid #e4e4e7; border-top: none; border-radius: 0 0 8px 8px;">
          <h2 style="margin-top: 0;">Rappel d'echeance</h2>
          <p>L'echeance suivante arrive dans <strong>${opts.daysLeft} jour(s)</strong> :</p>
          <table style="width: 100%; border-collapse: collapse; margin: 16px 0;">
            <tr><td style="padding: 8px; border-bottom: 1px solid #e4e4e7; color: #71717a;">Client</td><td style="padding: 8px; border-bottom: 1px solid #e4e4e7; font-weight: 600;">${opts.clientName}</td></tr>
            <tr><td style="padding: 8px; border-bottom: 1px solid #e4e4e7; color: #71717a;">Echeance</td><td style="padding: 8px; border-bottom: 1px solid #e4e4e7; font-weight: 600;">${opts.deadlineTitle}</td></tr>
            <tr><td style="padding: 8px; border-bottom: 1px solid #e4e4e7; color: #71717a;">Type</td><td style="padding: 8px; border-bottom: 1px solid #e4e4e7;">${opts.deadlineType}</td></tr>
            <tr><td style="padding: 8px; color: #71717a;">Date</td><td style="padding: 8px; font-weight: 600; color: #dc2626;">${opts.dueDate}</td></tr>
          </table>
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/deadlines" style="display: inline-block; background: #18181b; color: white; padding: 10px 24px; border-radius: 6px; text-decoration: none; margin-top: 8px;">Voir l'echeancier</a>
          <p style="margin-top: 24px; font-size: 12px; color: #a1a1aa;">Cet email a ete envoye automatiquement par ComptaFlow.</p>
        </div>
      </div>
    `,
  });
}

// Email quand un client depose un document
export async function sendDocumentDepositNotification(opts: {
  to: string;
  clientName: string;
  documentName: string;
  documentType: string;
}) {
  const resend = getResend();
  return resend.emails.send({
    from: FROM_EMAIL,
    to: opts.to,
    subject: `[ComptaFlow] Nouveau document depose par ${opts.clientName}`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #18181b; color: white; padding: 20px; border-radius: 8px 8px 0 0;">
          <h1 style="margin: 0; font-size: 20px;">ComptaFlow</h1>
        </div>
        <div style="padding: 24px; border: 1px solid #e4e4e7; border-top: none; border-radius: 0 0 8px 8px;">
          <h2 style="margin-top: 0;">Nouveau document depose</h2>
          <p>Votre client <strong>${opts.clientName}</strong> vient de deposer un document :</p>
          <table style="width: 100%; border-collapse: collapse; margin: 16px 0;">
            <tr><td style="padding: 8px; border-bottom: 1px solid #e4e4e7; color: #71717a;">Document</td><td style="padding: 8px; border-bottom: 1px solid #e4e4e7; font-weight: 600;">${opts.documentName}</td></tr>
            <tr><td style="padding: 8px; color: #71717a;">Type</td><td style="padding: 8px;">${opts.documentType}</td></tr>
          </table>
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/documents" style="display: inline-block; background: #18181b; color: white; padding: 10px 24px; border-radius: 6px; text-decoration: none; margin-top: 8px;">Voir les documents</a>
          <p style="margin-top: 24px; font-size: 12px; color: #a1a1aa;">Cet email a ete envoye automatiquement par ComptaFlow.</p>
        </div>
      </div>
    `,
  });
}

// Email d'invitation client pour le portail
export async function sendClientInvitation(opts: {
  to: string;
  clientName: string;
  cabinetName: string;
  inviteUrl: string;
}) {
  const resend = getResend();
  return resend.emails.send({
    from: FROM_EMAIL,
    to: opts.to,
    subject: `${opts.cabinetName} vous invite sur ComptaFlow`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #18181b; color: white; padding: 20px; border-radius: 8px 8px 0 0;">
          <h1 style="margin: 0; font-size: 20px;">ComptaFlow</h1>
        </div>
        <div style="padding: 24px; border: 1px solid #e4e4e7; border-top: none; border-radius: 0 0 8px 8px;">
          <h2 style="margin-top: 0;">Vous etes invite !</h2>
          <p>Le cabinet <strong>${opts.cabinetName}</strong> vous invite a acceder a votre espace client sur ComptaFlow.</p>
          <p>Depuis cet espace vous pourrez :</p>
          <ul>
            <li>Deposer vos factures et justificatifs</li>
            <li>Echanger avec votre comptable</li>
            <li>Suivre l'avancement de votre dossier</li>
          </ul>
          <a href="${opts.inviteUrl}" style="display: inline-block; background: #18181b; color: white; padding: 12px 32px; border-radius: 6px; text-decoration: none; margin-top: 16px; font-weight: 600;">Acceder a mon espace</a>
          <p style="margin-top: 24px; font-size: 12px; color: #a1a1aa;">Si vous n'attendiez pas cet email, vous pouvez l'ignorer.</p>
        </div>
      </div>
    `,
  });
}
