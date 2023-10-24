import { createSlice } from "@reduxjs/toolkit";

export const newCollectionSlice = createSlice({
  name: "new collection",
  initialState: {
    basicDetails: {
      collectionName: "",
      symbol: "",
      size: "",
      website: "",
      description: "",
    },
    currentStep: 1,
    mintingDetails: {
      mintPerTx: "",
      mintPrice: "",
      mintPerWallet: "",
      mintStartTime: "",
    },
    ownershipDetails: {
      contractOwner: "",
      primarySaleFundsReceiver: "",
    },
    royaltyDetails: {
      royaltyBips: "",
      royaltyReceiver: "",
    },
    additionalFeatureDetails:{
      presaleEnabled:false,
      presaleLimit: "",
      presalePrice: 0,
      presaleMintPerTx:"",
      presaleMintPerWallet: "",
      presaleStartTime: "",
      airdropEnabled: false,
      changeableMintPricingEnabled: false,
      changeableSaleTimingEnabled: false,
      nftRevealEnabled: false,
      urevealedMetadata: "",
      premintEnabled: false,
      changeBaseUriEnabled: false
    },
    contentDetails:{
      contentCID:"",
      contentExtension: "select",
      metadataCID:""
    },
    totalCost: 0
  },
  reducers: {
    updateBasicDetails: (state, action) => {
      state.basicDetails = action.payload;
    },
    updateMintingDetails: (state, action) => {
      state.mintingDetails = action.payload;
    },
    updateContentDetails : (state, action) => {
      state.contentDetails = action.payload
    },
    updateOwnershipDetails: (state, action) => {
      state.ownershipDetails = action.payload;
    },
    updateRoyaltyDetails: (state, action) => {
      state.royaltyDetails = action.payload;
    },
    updateAddedFeaturesDetails:(state, action) => {
      state.additionalFeatureDetails = {...state.additionalFeatureDetails, ...action.payload}
    },
    incrementStep: (state) => {
      state.currentStep = state.currentStep + 1;
    },
    decrementStep: (state) => {
      state.currentStep = state.currentStep - 1;
    },
    resetStep: (state) => {
      state.currentStep = 1
    },
    setTotalCost: (state, action) => {
      state.totalCost = action.payload
    }
  },
});

export const {
  updateBasicDetails,
  updateMintingDetails,
  updateOwnershipDetails,
  incrementStep,
  decrementStep,
  updateRoyaltyDetails,
  updateAddedFeaturesDetails,
  updateContentDetails,
  resetStep,
  setTotalCost
} = newCollectionSlice.actions;
export default newCollectionSlice.reducer;
