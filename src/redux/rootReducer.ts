// redux
import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';
import createWebStorage from 'redux-persist/lib/storage/createWebStorage';
// slices
import authReducer from './slices/auth';
import productReducer from './slices/product';
import createSocialPostReducer from './slices/post/createSocialPost';
import searchReducer from './slices/search';
import sendPostReducer from './slices/post/sendPost';
import sharePostReducer from './slices/post/sharePost';
import uploadReducer from './slices/upload';
import connectionReducer from './slices/connection/connections';
// section slices
import userExperiencesReducer from './slices/profile/userExperiences-slice';
import userRelationShipReducer from './slices/profile/userRelationShip-slice';
import userLocationReducer from './slices/profile/userLocation-slice';
import userEmailsReducer from './slices/profile/userEmail-slice';
import userSocialMediasReducer from './slices/profile/userSocialMedia-slice';
import userWebsitesReducer from './slices/profile/userWebsite-slice';
import userPhoneNumberReducer from './slices/profile/userPhoneNumber-slice';
import userCertificatesReducer from './slices/profile/userCertificates-slice';
import userCollegesReducer from './slices/profile/userColleges-slice';
import userUniversityReducer from './slices/profile/userUniversity-slice';
import userSchoolsReducer from './slices/profile/userSchool-slice';
import homePageReducer from './slices/homePage';
import userpersonSkillReducer from './slices/profile/userSkill-slice';
import userMainInfoReducer from './slices/profile/userMainInfo-slice';
import ngoCategoryReducer from './slices/profile/ngoCategory-slice';
import ngoPublicDetailsReducer from './slices/profile/ngoPublicDetails-slice';
import selectMsgReducer from './slices/chat/selectMsgReducer';
import allMsgReducer from './slices/chat/allMsgReducer';
import selectedUSerReducer from './slices/chat/selectedUser';
// api-reducers
import { reducers as cognitoApiReducers } from './COGNITO_APIs';
import { reducers as profileApiReducers } from './PROFILE_APIs';
import { reducers as localityApiReducers } from './LOCALITY_APIs';
import { reducers as uploadApiReducers } from './UPLOAD_APIs';
import { reducers as postApiReducers } from './POST_APIs';
import { reducers as chatApiReducers } from './CHAT_APIs';
import { reducers as connectionApiReducers } from './CONNECTION_APIs';
import { reducers as postBehaviorApiReducers } from './POSTBEHAVIOR_APIs';
import { reducers as searchApiReducers } from './SEARCH_APIs';
import { reducers as historyApiReducers } from './HISTORY_APIs';

// ----------------------------------------------------------------------

const createNoopStorage = () => ({
  getItem(_key: string) {
    return Promise.resolve(null);
  },
  setItem(_key: string, value: any) {
    return Promise.resolve(value);
  },
  removeItem(_key: string) {
    return Promise.resolve();
  },
});

const storage = typeof window !== 'undefined' ? createWebStorage('local') : createNoopStorage();

const rootPersistConfig = {
  key: 'root',
  storage,
  keyPrefix: 'redux-',
  whitelist: [],
};

const productPersistConfig = {
  key: 'product',
  storage,
  keyPrefix: 'redux-',
  whitelist: ['sortBy', 'checkout'],
};

const rootReducer = combineReducers({
  ...cognitoApiReducers,
  ...profileApiReducers,
  ...localityApiReducers,
  ...uploadApiReducers,
  ...postApiReducers,
  ...chatApiReducers,
  ...connectionApiReducers,
  ...searchApiReducers,
  ...postBehaviorApiReducers,
  ...chatApiReducers,
  ...searchApiReducers,
  ...historyApiReducers,
  auth: authReducer,
  userRelationShip: userRelationShipReducer,
  userLocation: userLocationReducer,
  userExperiences: userExperiencesReducer,
  userEmails: userEmailsReducer,
  userSocialMedias: userSocialMediasReducer,
  userCertificates: userCertificatesReducer,
  userPersonSkill: userpersonSkillReducer,
  userWebsites: userWebsitesReducer,
  userPhoneNumber: userPhoneNumberReducer,
  userColleges: userCollegesReducer,
  userUniversity: userUniversityReducer,
  userSchools: userSchoolsReducer,
  userMainInfo: userMainInfoReducer,
  ngoCategory: ngoCategoryReducer,
  ngoPublicDetails: ngoPublicDetailsReducer,
  product: persistReducer(productPersistConfig, productReducer),
  createSocialPost: createSocialPostReducer,
  sharePost: sharePostReducer,
  sendPost: sendPostReducer,
  homePage: homePageReducer,
  upload: uploadReducer,
  connectionsList: connectionReducer,
  searchSlice: searchReducer,
  selectMsg: selectMsgReducer,
  allMsg: allMsgReducer,
  selectedUSer: selectedUSerReducer,
});

export { rootPersistConfig, rootReducer };
