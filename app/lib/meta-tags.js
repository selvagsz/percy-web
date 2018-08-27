/* eslint-disable max-len */
export default metaTagLookup;

function metaTagLookup(headTagKey) {
  return headTags[headTagKey];
}

const headTags = {
  root: [
    metaTitle('Percy | Automated Visual Testing - Visual Regression Testing'),
    metaDescription(
      'Powered by cross-browser testing, responsive visual testing, and smart visual regression testing, Percy helps teams design, develop, and deploy software with confidence.',
    ),
  ],
  pricing: [
    metaTitle('Visual Testing Plans and Pricing | Percy'),
    metaDescription(
      'Get started with Percy’s visual testing plans. Start testing your UI for visual changes today with our 14-day trial or learn about our enterprise pricing.',
    ),
  ],
  enterprise: [
    metaTitle('Enterprise Visual Testing at Scale | Percy'),
    metaDescription(
      'Percy the trusted visual testing provider for the most innovative teams. Learn more about our enterprise browser rendering infrastructure, integrations, and more.',
    ),
  ],
  team: [
    metaTitle('About Percy | Visual Testing As a Service'),
    metaDescription(
      'The Percy team is helping teams design, develop, and deliver software with confidence through visual testing as a service. Learn more about the people behind Percy.',
    ),
  ],
  changelog: [
    metaTitle('Visual Testing Platform Changelog | Percy'),
    metaDescription(
      'See what team Percy is building to make automated visual testing more efficient and accessible to all. Stay up to date with new Percy features, integrations, and updates.',
    ),
  ],
};

function metaDescription(content) {
  return {
    type: 'meta',
    attrs: {
      content,
      name: 'description',
    },
  };
}

function metaTitle(content) {
  return {
    type: 'meta',
    attrs: {
      content,
      name: 'title',
    },
  };
}
