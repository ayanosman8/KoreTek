import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';

// Define types for the proposal data
export interface ProposalData {
  // Project info
  projectName: string;
  summary: string;

  // Client info
  clientName: string;
  clientEmail?: string;
  clientCompany?: string;

  // Company info (user's business)
  companyName?: string;
  companyLogo?: string;
  companyEmail?: string;
  companyPhone?: string;
  companyAddress?: string;
  companyWebsite?: string;

  // Features and pricing
  features: Array<{
    name: string;
    description: string;
    tier: string;
    price?: number;
  }>;

  // Tech stack
  techStack?: {
    frontend?: string[];
    backend?: string[];
    database?: string[];
    auth?: string[];
    services?: string[];
    infrastructure?: string[];
  };

  // Pricing
  totalPrice?: number;

  // Timeline
  estimatedTimeline?: string;
  milestones?: Array<{
    name: string;
    duration: string;
    deliverables: string;
  }>;

  // Terms
  paymentTerms?: string;
  termsAndConditions?: string;

  // Colors
  primaryColor?: string;
}

// PDF Styles
const createStyles = (primaryColor: string = '#3b82f6') => StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 11,
    fontFamily: 'Helvetica',
    color: '#333',
  },

  // Cover page
  coverPage: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100%',
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 30,
    objectFit: 'contain',
  },
  coverTitle: {
    fontSize: 36,
    fontWeight: 'bold',
    color: primaryColor,
    marginBottom: 10,
    textAlign: 'center',
  },
  coverSubtitle: {
    fontSize: 18,
    color: '#666',
    marginBottom: 40,
    textAlign: 'center',
  },
  coverClient: {
    fontSize: 14,
    color: '#444',
    marginBottom: 5,
  },
  coverDate: {
    fontSize: 12,
    color: '#888',
    marginTop: 20,
  },

  // Section styles
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: primaryColor,
    marginBottom: 12,
    paddingBottom: 6,
    borderBottom: `2px solid ${primaryColor}`,
  },
  sectionContent: {
    fontSize: 11,
    lineHeight: 1.6,
    color: '#444',
  },

  // Feature list
  featureItem: {
    marginBottom: 15,
    paddingBottom: 15,
    borderBottom: '1px solid #eee',
  },
  featureName: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  featureDescription: {
    fontSize: 10,
    color: '#666',
    marginBottom: 5,
    lineHeight: 1.5,
  },
  featureTier: {
    fontSize: 9,
    color: primaryColor,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  featurePrice: {
    fontSize: 11,
    color: '#333',
    fontWeight: 'bold',
    marginTop: 5,
  },

  // Tech stack
  techCategory: {
    marginBottom: 10,
  },
  techCategoryTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  techItems: {
    fontSize: 10,
    color: '#666',
    lineHeight: 1.5,
  },

  // Pricing table
  pricingTable: {
    marginTop: 10,
  },
  pricingRow: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderBottom: '1px solid #eee',
  },
  pricingTotal: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 12,
    backgroundColor: primaryColor,
    color: 'white',
    fontWeight: 'bold',
    marginTop: 10,
  },

  // Timeline
  milestone: {
    marginBottom: 12,
    paddingLeft: 15,
    borderLeft: `3px solid ${primaryColor}`,
  },
  milestoneName: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 3,
  },
  milestoneDuration: {
    fontSize: 10,
    color: primaryColor,
    marginBottom: 3,
  },
  milestoneDeliverables: {
    fontSize: 10,
    color: '#666',
  },

  // Footer
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
    textAlign: 'center',
    fontSize: 9,
    color: '#888',
  },

  // Page number
  pageNumber: {
    position: 'absolute',
    bottom: 30,
    right: 40,
    fontSize: 9,
    color: '#888',
  },
});

export const ProposalPDF: React.FC<{ data: ProposalData }> = ({ data }) => {
  const styles = createStyles(data.primaryColor);
  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <Document>
      {/* Cover Page */}
      <Page size="A4" style={styles.page}>
        <View style={styles.coverPage}>
          {data.companyLogo && (
            <Image src={data.companyLogo} style={styles.logo} />
          )}
          <Text style={styles.coverTitle}>Project Proposal</Text>
          <Text style={styles.coverSubtitle}>{data.projectName}</Text>

          <View style={{ marginTop: 20 }}>
            <Text style={styles.coverClient}>Prepared for: {data.clientName}</Text>
            {data.clientCompany && (
              <Text style={styles.coverClient}>{data.clientCompany}</Text>
            )}
            {data.clientEmail && (
              <Text style={styles.coverClient}>{data.clientEmail}</Text>
            )}
          </View>

          {data.companyName && (
            <View style={{ marginTop: 30 }}>
              <Text style={styles.coverClient}>Prepared by: {data.companyName}</Text>
              {data.companyEmail && <Text style={styles.coverClient}>{data.companyEmail}</Text>}
              {data.companyPhone && <Text style={styles.coverClient}>{data.companyPhone}</Text>}
            </View>
          )}

          <Text style={styles.coverDate}>{currentDate}</Text>
        </View>
      </Page>

      {/* Executive Summary */}
      <Page size="A4" style={styles.page}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Executive Summary</Text>
          <Text style={styles.sectionContent}>{data.summary}</Text>
        </View>

        {/* Tech Stack */}
        {data.techStack && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Technology Stack</Text>

            {data.techStack.frontend && data.techStack.frontend.length > 0 && (
              <View style={styles.techCategory}>
                <Text style={styles.techCategoryTitle}>Frontend:</Text>
                <Text style={styles.techItems}>{data.techStack.frontend.join(', ')}</Text>
              </View>
            )}

            {data.techStack.backend && data.techStack.backend.length > 0 && (
              <View style={styles.techCategory}>
                <Text style={styles.techCategoryTitle}>Backend:</Text>
                <Text style={styles.techItems}>{data.techStack.backend.join(', ')}</Text>
              </View>
            )}

            {data.techStack.database && data.techStack.database.length > 0 && (
              <View style={styles.techCategory}>
                <Text style={styles.techCategoryTitle}>Database:</Text>
                <Text style={styles.techItems}>{data.techStack.database.join(', ')}</Text>
              </View>
            )}

            {data.techStack.auth && data.techStack.auth.length > 0 && (
              <View style={styles.techCategory}>
                <Text style={styles.techCategoryTitle}>Authentication:</Text>
                <Text style={styles.techItems}>{data.techStack.auth.join(', ')}</Text>
              </View>
            )}

            {data.techStack.services && data.techStack.services.length > 0 && (
              <View style={styles.techCategory}>
                <Text style={styles.techCategoryTitle}>Services:</Text>
                <Text style={styles.techItems}>{data.techStack.services.join(', ')}</Text>
              </View>
            )}

            {data.techStack.infrastructure && data.techStack.infrastructure.length > 0 && (
              <View style={styles.techCategory}>
                <Text style={styles.techCategoryTitle}>Infrastructure:</Text>
                <Text style={styles.techItems}>{data.techStack.infrastructure.join(', ')}</Text>
              </View>
            )}
          </View>
        )}

        <Text style={styles.pageNumber} render={({ pageNumber, totalPages }) => `Page ${pageNumber} of ${totalPages}`} fixed />
      </Page>

      {/* Scope of Work - Features */}
      <Page size="A4" style={styles.page}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Scope of Work</Text>

          {data.features.map((feature, index) => (
            <View key={index} style={styles.featureItem}>
              <Text style={styles.featureName}>{feature.name}</Text>
              <Text style={styles.featureDescription}>{feature.description}</Text>
              <Text style={styles.featureTier}>{feature.tier} tier</Text>
              {feature.price && (
                <Text style={styles.featurePrice}>${feature.price.toLocaleString()}</Text>
              )}
            </View>
          ))}
        </View>

        <Text style={styles.pageNumber} render={({ pageNumber, totalPages }) => `Page ${pageNumber} of ${totalPages}`} fixed />
      </Page>

      {/* Timeline & Milestones */}
      {data.milestones && data.milestones.length > 0 && (
        <Page size="A4" style={styles.page}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Project Timeline</Text>

            {data.estimatedTimeline && (
              <Text style={[styles.sectionContent, { marginBottom: 15 }]}>
                Estimated Duration: {data.estimatedTimeline}
              </Text>
            )}

            {data.milestones.map((milestone, index) => (
              <View key={index} style={styles.milestone}>
                <Text style={styles.milestoneName}>{milestone.name}</Text>
                <Text style={styles.milestoneDuration}>{milestone.duration}</Text>
                <Text style={styles.milestoneDeliverables}>{milestone.deliverables}</Text>
              </View>
            ))}
          </View>

          <Text style={styles.pageNumber} render={({ pageNumber, totalPages }) => `Page ${pageNumber} of ${totalPages}`} fixed />
        </Page>
      )}

      {/* Pricing */}
      <Page size="A4" style={styles.page}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Investment</Text>

          <View style={styles.pricingTable}>
            {data.features.filter(f => f.price).map((feature, index) => (
              <View key={index} style={styles.pricingRow}>
                <Text>{feature.name}</Text>
                <Text>${feature.price?.toLocaleString()}</Text>
              </View>
            ))}

            {data.totalPrice && (
              <View style={styles.pricingTotal}>
                <Text>Total Investment</Text>
                <Text>${data.totalPrice.toLocaleString()}</Text>
              </View>
            )}
          </View>

          {data.paymentTerms && (
            <View style={{ marginTop: 20 }}>
              <Text style={[styles.techCategoryTitle, { marginBottom: 8 }]}>Payment Terms:</Text>
              <Text style={styles.sectionContent}>{data.paymentTerms}</Text>
            </View>
          )}
        </View>

        <Text style={styles.pageNumber} render={({ pageNumber, totalPages }) => `Page ${pageNumber} of ${totalPages}`} fixed />
      </Page>

      {/* Terms & Conditions */}
      {data.termsAndConditions && (
        <Page size="A4" style={styles.page}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Terms & Conditions</Text>
            <Text style={styles.sectionContent}>{data.termsAndConditions}</Text>
          </View>

          <Text style={styles.pageNumber} render={({ pageNumber, totalPages }) => `Page ${pageNumber} of ${totalPages}`} fixed />
        </Page>
      )}

      {/* Signature Page */}
      <Page size="A4" style={styles.page}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Agreement</Text>
          <Text style={[styles.sectionContent, { marginBottom: 30 }]}>
            By signing below, both parties agree to the terms and scope outlined in this proposal.
          </Text>

          <View style={{ marginTop: 40 }}>
            <View style={{ marginBottom: 50 }}>
              <View style={{ borderBottom: '1px solid #333', width: 250, marginBottom: 8 }} />
              <Text style={{ fontSize: 10, color: '#666' }}>Client Signature</Text>
              <Text style={{ fontSize: 10, color: '#666', marginTop: 2 }}>{data.clientName}</Text>
            </View>

            <View>
              <View style={{ borderBottom: '1px solid #333', width: 250, marginBottom: 8 }} />
              <Text style={{ fontSize: 10, color: '#666' }}>Service Provider Signature</Text>
              <Text style={{ fontSize: 10, color: '#666', marginTop: 2 }}>{data.companyName || 'Your Company'}</Text>
            </View>
          </View>
        </View>

        {data.companyWebsite && (
          <Text style={styles.footer}>{data.companyWebsite}</Text>
        )}

        <Text style={styles.pageNumber} render={({ pageNumber, totalPages }) => `Page ${pageNumber} of ${totalPages}`} fixed />
      </Page>
    </Document>
  );
};
