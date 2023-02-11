// ----------------------------------------------------------------------

function path(root: string, sublink: string) {
  return `${root}${sublink}`;
}

const ROOTS_AUTH = '/auth';

const ROOTS_APP = '/';
const ROOTS_SEARCH = '/search';
const ROOTS_CHAT = '/chat';
const ROOTS_HELP = '/help';
// ----------------------------------------------------------------------
export const PATH_AUTH = {
  root: ROOTS_AUTH,
  signIn: path(ROOTS_AUTH, '/sign-in'),
  signUp: {
    root: path(ROOTS_AUTH, '/sign-up'),
    typeSelection: path(ROOTS_AUTH, '/sign-up/type-selection'),
    basicInfo: path(ROOTS_AUTH, '/sign-up/basic-info'),
    advancedInfo: path(ROOTS_AUTH, '/sign-up/advanced-info'),
    verification: path(ROOTS_AUTH, '/sign-up/verification'),
    successSignUp: path(ROOTS_AUTH, '/sign-up/success-signup'),
    connectionLostSignUp: path(ROOTS_AUTH, '/sign-up/connection-lost'),
  },
  resetPassword: path(ROOTS_AUTH, '/reset-password'),
  forgetPassword: path(ROOTS_AUTH, '/forget-password'),
  confirmForgetPassword: path(ROOTS_AUTH, '/confirmation-forget-password'),
  verify: path(ROOTS_AUTH, '/verify'),
  successResetPassword: path(ROOTS_AUTH, '/success-reset-password'),
};
export const PATH_HELP = {
  helpCenter: path(ROOTS_HELP, '/help-center'),
  category: path(ROOTS_HELP, '/category'),
  articles:path(ROOTS_HELP, '/articles'),
};
export const PATH_APP = {
  root: ROOTS_APP,
  comingSoon: '/coming-soon',
  maintenance: '/maintenance',
  notification:'/notification',
  page404: '/404',
  page500: '/500',
  chat: {
    root: path(ROOTS_CHAT, ''),
    new: path(ROOTS_CHAT, '/new'),
    conversation: path(ROOTS_CHAT, '/:conversationKey'),
  },

  user: {
    root: path(ROOTS_APP, '/user'),
    profile: path(ROOTS_APP, '/profile/user'),
    cards: path(ROOTS_APP, '/user/cards'),
    list: path(ROOTS_APP, '/user/list'),
    newUser: path(ROOTS_APP, '/user/new'),
    editById: path(ROOTS_APP, `/user/reece-chung/edit`),
    account: path(ROOTS_APP, '/user/account'),
  },
  search: {
    root: path(ROOTS_SEARCH, ''),
    all: path(ROOTS_SEARCH, '/All'),
    people: path(ROOTS_SEARCH, '/People'),
    ngo: path(ROOTS_SEARCH, '/Ngo'),
    post: path(ROOTS_SEARCH, '/Post'),
    fundraising: path(ROOTS_SEARCH, '/Fundraising'),
    companies: path(ROOTS_SEARCH, '/Companies'),
    media: path(ROOTS_SEARCH, '/Media'),
    hashtag: path(ROOTS_SEARCH, '/Hashtags'),
  },
  home: {
    index: '/home',
  },
  post: {
    postDetails: {
      index: path(ROOTS_APP, '/post/post-details'),
    },
    moreMedia: '/post/more-media',
    createPost: {
      socialPost: {
        index: '/post/social-post/create',
        addLocation: '/post/social-post/add-location',
        addGif: '/post/social-post/add-gif',
      },
    },
    report: {
      root: path(ROOTS_APP, '/post-report'),
      success: path(ROOTS_APP, '/report-success'),
    },
    sharePost: {
      index: path(ROOTS_APP, '/post/share-post'),
      addLocation: path(ROOTS_APP, '/post/share-post/add-share-location'),
    },

    sendPost: {
      index: path(ROOTS_APP, '/post/send-post'),
      sendToConnections: path(ROOTS_APP, '/post/send-post/send-to-connections'),
    },
  },
  profile: {
    wizardList: path(ROOTS_APP, 'wizard-list'),
    wizardListNgo: path(ROOTS_APP, 'wizard-list-ngo'),
    posts: {
      root: path(ROOTS_APP, 'profile/posts'),
    },
    user: {
      root: path(ROOTS_APP, 'profile/user'),
      profileView: {
        contactsInfo: path(ROOTS_APP, 'profile/user/view/contact-info'),
        certificates: path(ROOTS_APP, 'profile/user/view/certificate'),
        expriences: path(ROOTS_APP, 'profile/user/view/exprience'),
        skills: path(ROOTS_APP, 'profile/user/view/skill'),
      },
      editProfile: path(ROOTS_APP, 'profile/user/edit-profile/edit'),
      publicDetails: {
        List: path(ROOTS_APP, 'profile/user/public-details/list'),
        currentCity: path(ROOTS_APP, 'profile/user/public-details/current-city/current-city-form'),
      },
      experience: {
        list: path(ROOTS_APP, 'profile/user/experience/list'),
        newForm: path(ROOTS_APP, 'profile/user/experience/newform'),
      },
      view: { root: path(ROOTS_APP, '/profile/user/view') },
    },
    ngo: {
      root: path(ROOTS_APP, 'profile/ngo'),
      viewNgo: path(ROOTS_APP, 'profile/ngo/view'),
      bio: path(ROOTS_APP, 'profile/ngo/bio'),
      posts: path(ROOTS_APP, 'profile/ngo/more-post/morePost'),
      project: {
        list: path(ROOTS_APP, 'profile/ngo/project/list'),
        new: path(ROOTS_APP, 'profile/ngo/project/newform'),
      },
      certificate: {
        list: path(ROOTS_APP, 'profile/ngo/certificate/list'),
        newForm: path(ROOTS_APP, 'profile/ngo/certificate/newForm'),
      },
      publicDetails: {
        list: path(ROOTS_APP, 'profile/ngo/public-details/list'),
        ngoCategory: path(ROOTS_APP, 'profile/ngo/public-details/ngo-category'),
        ngoSize: path(ROOTS_APP, 'profile/ngo/public-details/ngo-size'),
        ngoEstablishedDate: path(ROOTS_APP, 'profile/ngo/public-details/ngo-established-date'),
        location: path(ROOTS_APP, 'profile/ngo/public-details/ngo-location'),
        locationName: path(ROOTS_APP, 'profile/ngo/public-details/ngo-location/select-location'),
      },
      contactInfo: {
        list: path(ROOTS_APP, 'profile/ngo/contact-info/list'),
        ngoEmail: path(ROOTS_APP, 'profile/ngo/contact-info/ngo-email'),
        ngoPhoneNumber: path(ROOTS_APP, 'profile/ngo/contact-info/ngo-phone-number'),
        ngoSocialLinks: path(ROOTS_APP, 'profile/ngo/contact-info/ngo-social-links'),
        ngoWebsite: path(ROOTS_APP, 'profile/ngo/contact-info/ngo-website/ngo-website'),
        verifyNgoEmail: path(ROOTS_APP, 'profile/ngo/contact-info/ngo-email/verify-email'),
        verifyNgoPhoneNumber: path(ROOTS_APP, 'profile/ngo/contact-info/ngo-phone-number/verify-phone-number'),
        confirmPasswordEmail: path(ROOTS_APP, 'profile/ngo/contact-info/ngo-email/confirm-password'),
        confirmPasswordPhoneNumber: path(ROOTS_APP, 'profile/ngo/contact-info/ngo-phone-number/confirm-password'),
      },
      profileView: {
        projects: path(ROOTS_APP, 'profile/ngo/view/projects'),
        certificates: path(ROOTS_APP, 'profile/ngo/view/certificates'),
      },
    },
    post: {
      root: path(ROOTS_APP, 'profile/posts'),
    },
  },
  report: {
    garden: path(ROOTS_APP, '/report/garden'),
    ngo: path(ROOTS_APP, '/campaigns/reports')
  },
};
