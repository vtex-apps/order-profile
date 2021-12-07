type Maybe<T> = T | null | undefined
/** All built-in and custom scalars, mapped to their actual values */
export interface Scalars {
  ID: string
  String: string
  Boolean: boolean
  Int: number
  Float: number
  InputValues: any
  /**
   * productCategoriesObject is a Record<string, string>, in the following format:
   * { '<categoryNumber>': '<categoryName>' }
   */
  productCategoriesObject: any
  IOSanitizedString: any
  IOUpload: any
  Upload: any
}

export interface AddedOptionItem {
  __typename?: 'AddedOptionItem'
  item?: Maybe<Item>
  compositionItem?: Maybe<CompositionItem>
  normalizedQuantity?: Maybe<Scalars['Int']>
  choiceType?: Maybe<Scalars['String']>
  extraQuantity?: Maybe<Scalars['Int']>
}

export interface Address {
  __typename?: 'Address'
  addressId?: Maybe<Scalars['ID']>
  addressType?: Maybe<AddressType>
  city?: Maybe<Scalars['String']>
  complement?: Maybe<Scalars['String']>
  country?: Maybe<Scalars['String']>
  geoCoordinates?: Maybe<Array<Maybe<Scalars['Float']>>>
  neighborhood?: Maybe<Scalars['String']>
  number?: Maybe<Scalars['String']>
  postalCode?: Maybe<Scalars['String']>
  receiverName?: Maybe<Scalars['String']>
  reference?: Maybe<Scalars['String']>
  state?: Maybe<Scalars['String']>
  street?: Maybe<Scalars['String']>
}

export interface AddressInput {
  addressId?: Maybe<Scalars['ID']>
  addressType?: Maybe<AddressType>
  addressQuery?: Maybe<Scalars['String']>
  city?: Maybe<Scalars['String']>
  complement?: Maybe<Scalars['String']>
  country?: Maybe<Scalars['String']>
  geoCoordinates?: Maybe<Array<Maybe<Scalars['Float']>>>
  neighborhood?: Maybe<Scalars['String']>
  number?: Maybe<Scalars['String']>
  postalCode?: Maybe<Scalars['String']>
  receiverName?: Maybe<Scalars['String']>
  reference?: Maybe<Scalars['String']>
  state?: Maybe<Scalars['String']>
  street?: Maybe<Scalars['String']>
}

export type AddressType =
  | 'residential'
  | 'commercial'
  | 'inStore'
  | 'giftRegistry'
  | 'pickup'
  | 'search'

export interface AssemblyOptionInput {
  assemblyId: Scalars['String']
  id?: Maybe<Scalars['ID']>
  quantity?: Maybe<Scalars['Int']>
  seller?: Maybe<Scalars['String']>
  inputValues?: Maybe<Scalars['InputValues']>
  options?: Maybe<AssemblyOptionInput[]>
}

export interface AssemblyOptionItem {
  __typename?: 'AssemblyOptionItem'
  added: Array<Maybe<AddedOptionItem>>
  removed: Array<Maybe<unknown>>
  parentPrice?: Maybe<Scalars['Float']>
}

export interface AssemblyOptionType {
  __typename?: 'AssemblyOptionType'
  assemblyId: Scalars['String']
  id?: Maybe<Scalars['ID']>
  quantity?: Maybe<Scalars['Int']>
  seller?: Maybe<Scalars['String']>
  inputValues?: Maybe<Scalars['InputValues']>
  options?: Maybe<AssemblyOptionType[]>
}

export interface CheckoutProfile {
  __typename?: 'CheckoutProfile'
  userProfileId?: Maybe<Scalars['String']>
  profileProvider?: Maybe<Scalars['String']>
  availableAccounts: Array<Scalars['String']>
  availableAddresses: Array<Maybe<Address>>
  userProfile?: Maybe<UserProfile>
}

export interface ClientData {
  __typename?: 'ClientData'
  email?: Maybe<Scalars['String']>
  firstName?: Maybe<Scalars['String']>
  lastName?: Maybe<Scalars['String']>
  document?: Maybe<Scalars['String']>
  documentType?: Maybe<Scalars['String']>
  phone?: Maybe<Scalars['String']>
  corporateName?: Maybe<Scalars['String']>
  tradeName?: Maybe<Scalars['String']>
  corporateDocument?: Maybe<Scalars['String']>
  stateInscription?: Maybe<Scalars['String']>
  corporatePhone?: Maybe<Scalars['String']>
  isCorporate?: Maybe<Scalars['Boolean']>
  profileCompleteOnLoading?: Maybe<Scalars['Boolean']>
  profileErrorOnLoading?: Maybe<Scalars['Boolean']>
  customerClass?: Maybe<Scalars['String']>
}

export interface ClientPreferencesData {
  __typename?: 'ClientPreferencesData'
  locale?: Maybe<Scalars['String']>
  optinNewsLetter?: Maybe<Scalars['Boolean']>
}

export interface ClientPreferencesDataInput {
  optinNewsLetter?: Maybe<Scalars['Boolean']>
  locale?: Maybe<Scalars['String']>
}

export interface CompositionItem {
  __typename?: 'CompositionItem'
  id?: Maybe<Scalars['ID']>
  minQuantity?: Maybe<Scalars['Int']>
  maxQuantity?: Maybe<Scalars['Int']>
  initialQuantity?: Maybe<Scalars['Int']>
  priceTable?: Maybe<Scalars['String']>
  seller?: Maybe<Scalars['String']>
}

export interface Coupon {
  __typename?: 'Coupon'
  code?: Maybe<Scalars['String']>
}

export interface DeliveryOption {
  __typename?: 'DeliveryOption'
  id?: Maybe<Scalars['String']>
  price?: Maybe<Scalars['Int']>
  estimate?: Maybe<Scalars['String']>
  isSelected?: Maybe<Scalars['Boolean']>
}

export interface ImageUrls {
  __typename?: 'ImageUrls'
  at1x: Scalars['String']
  at2x: Scalars['String']
  at3x: Scalars['String']
}

export interface InstallmentOption {
  __typename?: 'InstallmentOption'
  paymentSystem: Scalars['String']
  bin?: Maybe<Scalars['String']>
  paymentName?: Maybe<Scalars['String']>
  paymentGroupName?: Maybe<Scalars['String']>
  value: Scalars['Int']
}

export interface Item {
  __typename?: 'Item'
  additionalInfo?: Maybe<ItemAdditionalInfo>
  assemblyOptions?: Maybe<AssemblyOptionItem>
  availability?: Maybe<Scalars['String']>
  detailUrl?: Maybe<Scalars['String']>
  id: Scalars['ID']
  imageUrls?: Maybe<ImageUrls>
  listPrice: Scalars['Float']
  measurementUnit?: Maybe<Scalars['String']>
  name?: Maybe<Scalars['String']>
  parentAssemblyBinding?: Maybe<Scalars['String']>
  options?: Maybe<Array<Maybe<AssemblyOptionType>>>
  price: Scalars['Float']
  productCategories?: Maybe<Scalars['productCategoriesObject']>
  productCategoryIds?: Maybe<Scalars['String']>
  productId: Scalars['String']
  productRefId?: Maybe<Scalars['String']>
  quantity: Scalars['Float']
  sellingPrice: Scalars['Float']
  sellingPriceWithAssemblies?: Maybe<Scalars['Float']>
  skuName?: Maybe<Scalars['String']>
  skuSpecifications: SkuSpecification[]
  uniqueId: Scalars['String']
}

export interface ItemAdditionalInfo {
  __typename?: 'ItemAdditionalInfo'
  brandName?: Maybe<Scalars['String']>
}

export interface ItemInput {
  id?: Maybe<Scalars['Int']>
  index?: Maybe<Scalars['Int']>
  quantity?: Maybe<Scalars['Float']>
  seller?: Maybe<Scalars['ID']>
  uniqueId?: Maybe<Scalars['String']>
  inputValues?: Maybe<Scalars['InputValues']>
  options?: Maybe<Array<Maybe<AssemblyOptionInput>>>
}

export interface MarketingData {
  __typename?: 'MarketingData'
  utmCampaign?: Maybe<Scalars['String']>
  utmMedium?: Maybe<Scalars['String']>
  utmSource?: Maybe<Scalars['String']>
  utmiCampaign?: Maybe<Scalars['String']>
  utmiPart?: Maybe<Scalars['String']>
  utmiPage?: Maybe<Scalars['String']>
  coupon?: Maybe<Scalars['String']>
}

export interface MarketingDataInput {
  utmCampaign?: Maybe<Scalars['String']>
  utmMedium?: Maybe<Scalars['String']>
  utmSource?: Maybe<Scalars['String']>
  utmiCampaign?: Maybe<Scalars['String']>
  utmiPart?: Maybe<Scalars['String']>
  utmiPage?: Maybe<Scalars['String']>
}

export interface Message {
  __typename?: 'Message'
  code?: Maybe<Scalars['String']>
  status?: Maybe<Scalars['String']>
  text?: Maybe<Scalars['String']>
}

export interface OrderForm {
  id: Scalars['ID']
  items: unknown[]
  canEditData: Scalars['Boolean']
  loggedIn: Scalars['Boolean']
  userProfileId?: Maybe<Scalars['String']>
  userType?: Maybe<unknown>
  shipping: unknown
  marketingData: unknown
  totalizers: Totalizer[]
  value: Scalars['Float']
  messages: OrderFormMessages
  paymentData: unknown
  clientProfileData?: Maybe<unknown>
  clientPreferencesData?: Maybe<unknown>
  allowManualPrice?: Maybe<Scalars['Boolean']>
  openTextField?: Maybe<unknown>
  storePreferencesData?: Maybe<unknown>
}

export interface OrderFormMessages {
  __typename?: 'OrderFormMessages'
  couponMessages: Message[]
  generalMessages: Message[]
}

export interface Shipping {
  __typename?: 'Shipping'
  countries?: Maybe<Array<Maybe<Scalars['String']>>>
  deliveryOptions?: Maybe<Array<Maybe<DeliveryOption>>>
  selectedAddress?: Maybe<Address>
  availableAddresses?: Maybe<Array<Maybe<Address>>>
}

export interface SkuSpecification {
  __typename?: 'SKUSpecification'
  fieldName?: Maybe<Scalars['String']>
  fieldValues: Array<Maybe<Scalars['String']>>
}

export interface Totalizer {
  __typename?: 'Totalizer'
  id: Scalars['String']
  name?: Maybe<Scalars['String']>
  value: Scalars['Int']
}

export interface UserProfile {
  __typename?: 'UserProfile'
  email: Scalars['String']
  firstName: Scalars['String']
  lastName: Scalars['String']
  document?: Maybe<Scalars['String']>
  documentType?: Maybe<Scalars['String']>
  phone?: Maybe<Scalars['String']>
  corporateName?: Maybe<Scalars['String']>
  tradeName?: Maybe<Scalars['String']>
  corporateDocument?: Maybe<Scalars['String']>
  stateInscription?: Maybe<Scalars['String']>
  corporatePhone?: Maybe<Scalars['String']>
  isCorporate: Scalars['Boolean']
  profileCompleteOnLoading?: Maybe<Scalars['String']>
  profileErrorOnLoading?: Maybe<Scalars['String']>
  customerClass?: Maybe<Scalars['String']>
}

export interface UserProfileInput {
  email?: Maybe<Scalars['String']>
  firstName?: Maybe<Scalars['String']>
  lastName?: Maybe<Scalars['String']>
  document?: Maybe<Scalars['String']>
  phone?: Maybe<Scalars['String']>
  documentType?: Maybe<Scalars['String']>
  isCorporate?: Maybe<Scalars['Boolean']>
  corporateName?: Maybe<Scalars['String']>
  tradeName?: Maybe<Scalars['String']>
  corporateDocument?: Maybe<Scalars['String']>
  stateInscription?: Maybe<Scalars['String']>
}

export interface Validator {
  __typename?: 'Validator'
  regex?: Maybe<Scalars['String']>
  mask?: Maybe<Scalars['String']>
  cardCodeRegex?: Maybe<Scalars['String']>
  cardCodeMask?: Maybe<Scalars['String']>
  weights?: Maybe<Array<Maybe<Scalars['Int']>>>
  useCvv?: Maybe<Scalars['Boolean']>
  useExpirationDate?: Maybe<Scalars['Boolean']>
  useCardHolderName?: Maybe<Scalars['Boolean']>
  useBillingAddress?: Maybe<Scalars['Boolean']>
}

export {}
