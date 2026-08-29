import { getSiteContent, CONTENT_KEYS } from "@/lib/site-content";
import ContentEditorForm from "@/components/admin/ContentEditorForm";

export const dynamic = "force-dynamic";

export default async function AdminContentPage() {
  const content = await getSiteContent();

  return (
    <div className="max-w-2xl">
      <h1 className="font-display text-2xl text-cream">Site Content</h1>
      <p className="mt-1 text-sm text-cream-dim">
        Edit the text shown on the homepage, About page, and legal pages — changes go live immediately.
      </p>

      <div className="mt-8">
        <h2 className="font-display text-lg text-cream">Homepage Hero</h2>
        <div className="mt-4">
          <ContentEditorForm
            initialValues={content}
            fields={[
              { key: CONTENT_KEYS.heroEyebrow, label: "Small text above heading", type: "input" },
              { key: CONTENT_KEYS.heroHeadingLine1, label: "Heading — line 1", type: "input" },
              { key: CONTENT_KEYS.heroHeadingLine2, label: "Heading — line 2", type: "input" },
              { key: CONTENT_KEYS.heroSubtext, label: "Subtext paragraph", type: "textarea", rows: 3 },
            ]}
          />
        </div>
      </div>

      <div className="mt-12">
        <h2 className="font-display text-lg text-cream">About Page</h2>
        <div className="mt-4">
          <ContentEditorForm
            initialValues={content}
            fields={[
              { key: CONTENT_KEYS.aboutEyebrow, label: "Small text above heading", type: "input" },
              { key: CONTENT_KEYS.aboutHeading, label: "Main heading", type: "input" },
              { key: CONTENT_KEYS.aboutIntro, label: "Intro paragraph", type: "textarea", rows: 4 },
              { key: CONTENT_KEYS.aboutSection1Title, label: "Section 1 title", type: "input" },
              { key: CONTENT_KEYS.aboutSection1Body, label: "Section 1 text", type: "textarea", rows: 3 },
              { key: CONTENT_KEYS.aboutSection2Title, label: "Section 2 title", type: "input" },
              { key: CONTENT_KEYS.aboutSection2Body, label: "Section 2 text", type: "textarea", rows: 3 },
            ]}
          />
        </div>
      </div>

      <div className="mt-12">
        <h2 className="font-display text-lg text-cream">Legal Pages</h2>
        <div className="mt-4 space-y-6">
          <div>
            <p className="mb-2 font-utility text-xs uppercase tracking-wide text-gold">Privacy Policy</p>
            <ContentEditorForm
              initialValues={content}
              fields={[{ key: CONTENT_KEYS.legalPrivacyPolicy, label: "Content", type: "textarea", rows: 8 }]}
            />
          </div>
          <div>
            <p className="mb-2 font-utility text-xs uppercase tracking-wide text-gold">Terms &amp; Conditions</p>
            <ContentEditorForm
              initialValues={content}
              fields={[{ key: CONTENT_KEYS.legalTerms, label: "Content", type: "textarea", rows: 8 }]}
            />
          </div>
          <div>
            <p className="mb-2 font-utility text-xs uppercase tracking-wide text-gold">Refund Policy</p>
            <ContentEditorForm
              initialValues={content}
              fields={[{ key: CONTENT_KEYS.legalRefundPolicy, label: "Content", type: "textarea", rows: 8 }]}
            />
          </div>
          <div>
            <p className="mb-2 font-utility text-xs uppercase tracking-wide text-gold">Shipping Policy</p>
            <ContentEditorForm
              initialValues={content}
              fields={[{ key: CONTENT_KEYS.legalShippingPolicy, label: "Content", type: "textarea", rows: 8 }]}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
