import { test } from '@playwright/test';

test.describe('Task 3', () => {
  let alleleReq;
  let alleleResponse;

  test.beforeEach(async ({ request }) => {
    alleleReq = await request.get('https://api.cpicpgx.org/v1/allele');
    alleleResponse = await alleleReq.json();
  });

  test('Task 3.1 - validating that each ethnicity frequency is les then 1 OR null', async () => {
    let frequency: boolean = true;
    for (let i = 0; i < alleleResponse.length; i++) {
      if (alleleResponse[i].genesymbol == 'CYP2D6') {
        if (alleleResponse[i].frequency != null) {
          for (const ethnicity in alleleResponse[i].frequency) {
            if (alleleResponse[i].frequency[ethnicity] < 1 || alleleResponse[i].frequency[ethnicity] == null) {
              frequency = true;
            } else {
              frequency = false;
            }
          }
        }
      }
    }
    if (frequency) {
      console.log('All genesymbol CYP2D6 have ethnicity frequency lower then 1 or null');
    }
  });

  test('Task 3.2 - summing each ethnicity frequencies in CYP2D6', async () => {
    const ethnicities = ['Latino', 'American', 'European', 'Oceanian', 'East Asian', 'Near Eastern', 'Central/South Asian', 'Sub-Saharan African', 'African American/Afro-Caribbean'];
    let enthnicitiesSum: Number[] = [];
    for (let name in ethnicities) {
      let enthnicitySum = 0;
      for (let i = 0; i < alleleResponse.length; i++) {
        if (alleleResponse[i].genesymbol == 'CYP2D6') {
          //validate that frequency is not empty
          if (alleleResponse[i].frequency != null) {
            //validate that frequency has key
            if (alleleResponse[i].frequency.hasOwnProperty(ethnicities[name])) {
              //validate that the value of the key in not null
              if (alleleResponse[i].frequency[ethnicities[name]] != null) {
                enthnicitySum += alleleResponse[i].frequency[ethnicities[name]];
              }
            }
          }
        }
      }
      enthnicitiesSum.push(enthnicitySum);
    }
    console.log('These are the enthnicities with sum of frequencies in all CYP2D6 alleles that are lower then 1:');
    for (let value in enthnicitiesSum) {
      if (enthnicitiesSum[value] < 1) {
        console.log(ethnicities[value] + ' : ' + enthnicitiesSum[value]);
      }
    }
  });

  test('Task 3.3 - validating that if there are findings, then there are at least one citations Or strength=No Evidence', async () => {
    let ids: String[] = [];
    for (let i = 0; i < alleleResponse.length; i++) {
      if (alleleResponse[i].findings != null) {
        if (alleleResponse[i].citations.length >= 1 || alleleResponse[i].strength == 'No Evidence') {
          ids.push(alleleResponse[i].id);
        }
      }
    }
    console.log('There are ' + ids.length + ' alleles with findings, at least one citations and strength=No Evidence');
    console.log('IDS:' + ids);
  });
});
