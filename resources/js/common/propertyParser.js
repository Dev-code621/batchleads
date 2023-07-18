import { formatDateString } from '~common/helper';

const getFormatedMonth = (monthCount) => {
  function getPlural(number, word) {
    return (number === 1 && word.one) || word.other;
  }

  const months = { one: 'month', other: 'months' };
  const years = { one: 'year', other: 'years' };
  const m = monthCount % 12;
  const y = Math.floor(monthCount / 12);
  const result = [];
  if (y) {
    result.push(`${y} ${getPlural(y, years)}`);
  }
  if (m) {
    result.push(`${m} ${getPlural(m, months)}`);
  }
  return result.join(' ');
};

const getVacantString = (vacant) => {
  if ((vacant === 'Y' || vacant === '1' || vacant === true)) {
    return 'Yes'
  }
  if ((vacant === 'N' || vacant === '0' || vacant === false)) {
    return 'No'
  }
  return '--'
}

export const getDetails = (property) => {
  const summary = [
    { label: 'Year built', value: property.Year_Built || '--' },
    {
      label: 'Square Feet',
      value: property.Square_Footage ? parseFloat(property.Square_Footage).toLocaleString() : '--',
    },
    { label: 'Bedrooms', value: property.Number_of_Bedrooms || '--' },
    { label: 'Bathrooms', value: property.Number_of_Baths || '--' },
    {
      label: 'No. of Units',
      value: property.Number_of_Units ? parseFloat(property.Number_of_Units).toLocaleString() : '--',
    },
    { label: 'Owner Name', value: `${property.Owner1FirstName || ''} ${property.Owner1LastName || ''}` },
    { label: 'Mailing Address', value: property.address2 || property.address1, icon: 'copy' },
  ]
  const information = [
    { label: 'Vacant', value: getVacantString(property.vacant) },
    { label: 'Owner Type', value: property.Owner_Type || '--' },
    {
      label: 'Ownership Length',
      value: property.Length_of_Residence_Months ? getFormatedMonth(Number(property.Length_of_Residence_Months)) : '--',
    },
    { label: 'Owner Occupied', value: (property.Owner_Occupied === 'Y' || property.Owner_Occupied === '1' || property.Owner_Occupied === true) ? 'Yes' : 'No' },
    { label: 'Last Sale Date', value: property.Sale_Date ? formatDateString(property.Sale_Date) : '--' },
    { label: 'Mailing Vacant', value: (property.Owner_Occupied === 'Y' || property.Owner_Occupied === '1' || property.Owner_Occupied === true) ? 'No' : 'Yes' },
  ];
  const details = [
    { label: 'Year built', value: property.Year_Built || '--' },
    {
      label: 'Square Feet',
      value: property.Square_Footage ? parseFloat(property.Square_Footage).toLocaleString() : '--',
    },
    { label: 'Bedrooms', value: property.Number_of_Bedrooms || '--' },
    { label: 'Bathrooms', value: property.Number_of_Baths || '--' },
    {
      label: 'Number of Units',
      value: property.Number_of_Units ? parseFloat(property.Number_of_Units).toLocaleString() : '--',
    },
    { label: 'Pool', value: property.pool || '--' },
    {
      label: 'Number of Fireplaces',
      value: property.fireplace ? parseFloat(property.fireplace).toLocaleString() : '--',
    },
    { label: 'Air Conditioning Source', value: property.Air_Conditioning_Source || '--' },
    { label: 'Air Conditioning Type', value: property.Air_Conditioning_Type || '--' },
    { label: 'Construction Type', value: property.Construction_Type || '--' },
    { label: 'Heating Type', value: property.Heating_Type || '--' },
    { label: 'Garage Type', value: property.Garage_Type || '--' },
    { label: 'Roof Type', value: property.Roof_Type || '--' },
    {
      label: 'Number of Stories',
      value: property.No_of_Stories ? parseFloat(property.No_of_Stories).toLocaleString() : '--',
    },
    { label: 'Foundation', value: property.foundation || '--' },
    {
      label: 'Number of Garages',
      value: property.Number_of_Garages ? parseFloat(property.Number_of_Garages).toLocaleString() : '--',
    },
  ];
  const land = [
    { label: 'Lot Size', value: '--' },
    { label: 'APN', value: property.Assessors_Parcel_Number || '--' },
    { label: 'Property Class', value: property.property_class || '--' },
    { label: 'Property Type', value: property.Property_Type || '--' },
    { label: 'Zoning', value: property.zoning || '--' },
    {
      label: 'Lot Size Acres',
      value: property.Lot_Size_Acres ? parseFloat(property.Lot_Size_Acres).toLocaleString() : '--',
    },
    { label: 'Legal Description', value: property.Legal_Description || '--' },
    {
      label: 'Lot Number',
      value: property.Lot_Number ? parseFloat(property.Lot_Number).toLocaleString() : '--',
    },
    { label: 'Subdivision', value: property.subdivision || '--' },
  ];
  const assessment = [
    {
      label: 'Total Assessed Value',
      value: property.Total_Assessed_Value ? parseFloat(property.Total_Assessed_Value).toLocaleString() : '--',
    },
    {
      label: 'Market Total Value',
      value: property.totalMarketValue ? parseFloat(property.totalMarketValue).toLocaleString() : '--',
    },
    {
      label: 'Market Land Value',
      value: property.Land_Value ? parseFloat(property.Land_Value).toLocaleString() : '--',
    },
    { label: 'Assessment Year', value: formatDateString(property.Assessment_Year) || '--' },
    {
      label: 'Tax Amount',
      value: property.taxAmount ? parseFloat(property.taxAmount).toLocaleString() : '--',
    },
    { label: 'Tax Year', value: property.taxYear || '--' },
    {
      label: 'Market Improvements Value',
      value: property.Improvement_Value ? parseFloat(property.Improvement_Value).toLocaleString() : '--',
    },
    {
      label: 'Assessed Improvement Value',
      value: property.assessedImprovementValue ? parseFloat(property.assessedImprovementValue).toLocaleString() : '--',
    },
    {
      label: 'Assessed Land Value',
      value: property.Land_Value ? parseFloat(property.Land_Value).toLocaleString() : '--',
    },
    { label: 'Market Value Year', value: property.marketValueYear || '--' },
  ];
  const sale = [
    {
      label: 'Number Of Open Mortgages',
      value: property.Total_Open_Lien_Count ? parseFloat(property.Total_Open_Lien_Count).toLocaleString() : '--',
    },
    {
      label: 'Total Mortgage Balance',
      value: property.Total_Open_Lien_Balance ? parseFloat(property.Total_Open_Lien_Balance).toLocaleString() : '--',
    },
    {
      label: 'Total Financing History Count',
      value: property.totalFinancingHistoryCount ? parseFloat(property.totalFinancingHistoryCount).toLocaleString() : '--',
    },
    { label: 'Sale Date', value: property.Sale_Date ? formatDateString(property.Sale_Date) : '--' },
    { label: 'Document Type', value: property.documentType || '--' },
    { label: 'DistressedSale', value: property.distressedSaleFlag || '--' },
    { label: 'Lender Name', value: property.Lender_Name || '--' },
    { label: 'Lender Type', value: property.lenderType || '--' },
    { label: 'Original Date of Contract', value: property.originalDateOfContract ? formatDateString(property.originalDateOfContract) : '--' },
    { label: 'Recording Date', value: property.recordingDate ? formatDateString(property.recordingDate) : '--' },
    {
      label: 'Loan Amount',
      value: property.Mtg01_Loan_Amount ? parseFloat(property.Mtg01_Loan_Amount).toLocaleString() : '--',
    },
    { label: 'Loan Type', value: property.Mtg01_loan_type || '--' },
    { label: 'Type of Financing', value: property.typeFinancing || '--' },
    { label: 'Interest Rate', value: property.Mtg01_interest_rate || '--' },
    { label: 'Mortage Due Date', value: property.Mtg01_due_date ? formatDateString(property.Mtg01_due_date) : '--' },
    {
      label: 'Lender Mailing Address',
      value:
        (property.lenderMailingAddress_street || '')
        + (property.lenderMailingAddress_street ? ', ' : '')
        + (property.lenderMailingAddress_city || '')
        + (property.lenderMailingAddress_city ? ', ' : '')
        + (property.lenderMailingAddress_state || '')
        + (property.lenderMailingAddress_state ? ', ' : '')
        + (property.lenderMailingAddress_zip || ''),
    },
    {
      label: 'Estimated Loan Balance',
      value: property.Current_Est_Equity_Dollars ? parseFloat(property.Current_Est_Equity_Dollars).toLocaleString() : '--',
    },
    { label: 'Estimated Monthly P&I', value: property.estimatedMonthlyPrincipalAndInterest || '--' },
    { label: 'Estimated Monthly Principle', value: property.estimatedMonthlyPrincipal || '--' },
    { label: 'Estimated Monthly Interest', value: property.estimatedMonthlyInterest || '--' },
  ];
  const demographics = [
    { label: 'Owner Age', value: property.age || '--' },
    {
      label: 'Household Size',
      value: property.householdSize ? parseFloat(property.householdSize).toLocaleString() : '--',
    },
    {
      label: 'Income',
      value: property.income ? parseFloat(property.income).toLocaleString() : '--',
    },
    {
      label: 'Net Worth',
      value: property.netWorth ? parseFloat(property.netWorth).toLocaleString() : '--',
    },
    {
      label: 'Discretionary Income',
      value: property.discretionaryIncome ? parseFloat(property.discretionaryIncome).toLocaleString() : '--',
    },
    { label: 'Business Owner', value: property.businessOwner || '--' },
    { label: 'Gender', value: property.gender || '--' },
    { label: 'Has Children', value: property.hasChildren || '--' },
    { label: 'Real Estate Investors', value: property.investmentRealEstate || '--' },
    { label: 'Marital Status', value: property.maritalStatus || '--' },
    { label: 'Pet Owner', value: property.petOwner || '--' },
    { label: 'Single Parent', value: property.singleParent || '--' },
    { label: 'Smoker', value: property.smoker || '--' },
    { label: 'Vehicles Owned', value: property.vehiclesOwned || '--' },
    { label: 'Religious Affiliations', value: property.religiousAffiliation || '--' },
  ];
  const printDetails = [
    { label: 'Year built', value: property.Year_Built || '--' },
    {
      label: 'Square Feet',
      value: property.LotSize_Square_Feet ? `${parseFloat(property.LotSize_Square_Feet).toLocaleString()} SqFt` : '--',
    },
    { label: 'Bedrooms', value: property.Number_of_Bedrooms || '--' },
    { label: 'Bathrooms', value: property.Number_of_Baths || '--' },
    {
      label: 'No. of Units',
      value: property.Number_of_Units ? parseFloat(property.Number_of_Units).toLocaleString() : '--',
    },
    { label: 'Owner Name', value: `${property.Owner1FirstName || ''} ${property.Owner1LastName || ''}` },
    { label: 'Currently Listed', value: property.Listed ? 'Yes' : 'No' },
    { label: 'Liens', value: property.Total_Open_Lien_Count || 'No' },
    { label: 'Property Vacant', value: (property.Owner_Occupied === 'Y' || property.Owner_Occupied === '1' || property.Owner_Occupied === true || property.Owner_Occupied === 'true') ? 'No' : 'Yes' },
    { label: 'Mailing Vacant', value: (property.Owner_Occupied === 'Y' || property.Owner_Occupied === '1' || property.Owner_Occupied === true || property.Owner_Occupied === 'true') ? 'No' : 'Yes' },
    { label: 'Owner Type', value: property.Owner_Type || '--' },
    {
      label: 'Ownership Length',
      value: property.Length_of_Residence_Months ? getFormatedMonth(Number(property.Length_of_Residence_Months)) : '--',
    },
    { label: 'Owner Occupied', value: (property.Owner_Occupied === 'Y' || property.Owner_Occupied === '1' || property.Owner_Occupied === true || property.Owner_Occupied === 'true') ? 'Yes' : 'No' },
    { label: 'Last Sale Date', value: property.Last_Sale_Date ? formatDateString(property.Last_Sale_Date) : '--' },
    { label: 'Opt-Out', value: property.Liens || '--' },
    { label: 'Skiped Traced', value: property.skip_tracing_date ? `Yes ${formatDateString(property.skip_tracing_date)}` : 'No' },
  ]
  const printOwnership = [
    { label: 'Owner Full Name', value: `${property.Owner1FirstName || ''} ${property.Owner1LastName || ''}` },
    { label: 'Owner 2 Full Name', value: `${property.Owner2FirstName || ''} ${property.Owner2LastName || ''}` },
    { label: 'Mailing Address', value: property.address2 || property.address1, icon: 'copy' },
  ];
  const printCharacteristics = [
    {
      label: 'Square Feet',
      value: property.LotSize_Square_Feet ? `${parseFloat(property.LotSize_Square_Feet).toLocaleString()} SqFt` : '--',
    },
    { label: 'Year built', value: property.Year_Built || '--' },
    {
      label: 'No. of Units',
      value: property.Number_of_Units ? parseFloat(property.Number_of_Units).toLocaleString() : '--',
    },
    {
      label: 'Number of Stories',
      value: property.No_of_Stories ? parseFloat(property.No_of_Stories).toLocaleString() : '--',
    },
    { label: 'Exterior Wall Type', value: property.Wall_Types || '--' },
    { label: 'Bedrooms', value: property.Number_of_Bedrooms || '--' },
    { label: 'Bathrooms', value: property.Number_of_Baths || '--' },
    { label: 'AC Type', value: property.Air_Conditioning_Type || '--' },
    {
      label: 'Number of Fireplaces',
      value: property.fireplace ? parseFloat(property.fireplace).toLocaleString() : '--',
    },
    { label: 'Heating Type', value: property.Heating_Type || '--' },
    { label: 'Pool', value: property.pool || '--' },
    {
      label: 'Building Size',
      value: property.householdSize ? `${parseFloat(property.householdSize).toLocaleString()} SqFt` : '--',
    },
    { label: 'Roof Type', value: property.Roof_Type || '--' },
    { label: 'Floor Type', value: property.Floor_type || '--' },
    { label: 'Garage Type', value: property.Garage_Type || '--' },
    { label: 'Building Quality', value: property.Building_Quality || '--' },
    { label: 'Construction Type', value: property.Construction_Type || '--' },
  ];
  const printLand = [
    { label: 'Lot Size', value: property.LotSize_Square_Feet ? `${property.LotSize_Square_Feet} SqFt` : '--' },
    { label: 'Subdivision Name', value: property.subdivision || '--' },
    { label: 'APN', value: property.Assessors_Parcel_Number || '--' },
    {
      label: 'Lot Number',
      value: property.Lot_Number ? parseFloat(property.Lot_Number).toLocaleString() : '--',
    },
    { label: 'Property Class', value: property.property_class || '--' },
    { label: 'County Land Use Code', value: property.CO_Unit_Number || '--' },
    { label: 'Property Type', value: property.Property_Type || '--' },
    { label: 'Meridian', value: property.location_longitude || '--' },
    { label: 'Census Tract', value: '--' },
    {
      label: 'Lot Area',
      value: property.Lot_Size_Acres ? `${parseFloat(property.Lot_Size_Acres).toLocaleString()} ` : '--',
    },
    { label: 'Zoning', value: property.zoning || '--' },
  ];
  const printTax = [
    { label: 'Parcel #', value: property.Assessors_Parcel_Number || '--' },
    { label: 'Current Owner', value: `${property.Owner1FirstName || ''} ${property.Owner1LastName || ''}` },
    {
      label: 'Tax Amount',
      value: property.taxAmount ? parseFloat(property.taxAmount).toLocaleString() : '--',
    },
    {
      label: 'Total Assessed Value',
      value: property.Total_Assessed_Value ? parseFloat(property.Total_Assessed_Value).toLocaleString() : '--',
    },
    {
      label: 'Market Land Value',
      value: property.Land_Value ? parseFloat(property.Land_Value).toLocaleString() : '--',
    },
    { label: 'Tax Year', value: property.taxYear || '--' },
    {
      label: 'Market Total Value',
      value: property.totalMarketValue ? parseFloat(property.totalMarketValue).toLocaleString() : '--',
    },
    { label: 'Assessment Year', value: formatDateString(property.Assessment_Year) || '--' },
    { label: 'Market Value Year', value: property.marketValueYear || '--' },
    {
      label: 'Market Improvements Value',
      value: property.Improvement_Value ? parseFloat(property.Improvement_Value).toLocaleString() : '--',
    },
    {
      label: 'Assessed Land Value',
      value: property.Land_Value ? parseFloat(property.Land_Value).toLocaleString() : '--',
    },
    {
      label: 'Assessed Improvement Value',
      value: property.assessedImprovementValue ? parseFloat(property.assessedImprovementValue).toLocaleString() : '--',
    },
    {
      label: 'Tax Mailing Address',
      value: `${property.lenderMailingAddress_unitNumber || ''} ${property.lenderMailingAddress_city || ''} ${property.lenderMailingAddress_zip || ''}`,
    },
  ];
  const printDemographics = [
    { label: 'Owner Age', value: property.age || '--' },
    {
      label: 'Income',
      value: property.income ? parseFloat(property.income).toLocaleString() : '--',
    },
    {
      label: 'Discretionary Income',
      value: property.discretionaryIncome ? parseFloat(property.discretionaryIncome).toLocaleString() : '--',
    },
    {
      label: 'Net Worth',
      value: property.netWorth ? parseFloat(property.netWorth).toLocaleString() : '--',
    },
    { label: 'Gender', value: property.gender || '--' },
    {
      label: 'Household Size',
      value: property.householdSize ? parseFloat(property.householdSize).toLocaleString() : '--',
    },
    { label: 'Real Estate Investors', value: property.investmentRealEstate || '--' },
    { label: 'Marital Status', value: property.maritalStatus || '--' },
    { label: 'Smoker', value: property.smoker || '--' },
    { label: 'Vehicles Owned', value: property.vehiclesOwned || '--' },
    { label: 'Has Children', value: property.hasChildren || '--' },
    { label: 'Single Parent', value: property.singleParent || '--' },
    { label: 'Business Owner', value: property.businessOwner || '--' },
    { label: 'Religious Affiliations', value: property.religiousAffiliation || '--' },
    { label: 'Pet Owner', value: property.petOwner || '--' },
  ];

  return {
    information,
    details,
    land,
    assessment,
    sale,
    demographics,
    summary,
    printDetails,
    printOwnership,
    printCharacteristics,
    printLand,
    printTax,
    printDemographics,
  };
};
