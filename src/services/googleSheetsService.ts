import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithPopup, 
  GoogleAuthProvider, 
  onAuthStateChanged, 
  User, 
  signOut 
} from 'firebase/auth';
import firebaseConfig from '../../firebase-applet-config.json';
import { PlantObservation } from '../types';

// Initialize Firebase App singleton
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(app);

const provider = new GoogleAuthProvider();
// Workspace scopes requested by user
provider.addScope('https://www.googleapis.com/auth/spreadsheets');
provider.addScope('https://www.googleapis.com/auth/drive.file');

// In-memory access token cache (NEVER in localStorage/sessionStorage)
let cachedAccessToken: string | null = null;
let isSigningIn = false;

export const initGoogleAuth = (
  onAuthSuccess?: (user: User, token: string) => void,
  onAuthFailure?: () => void
) => {
  return onAuthStateChanged(auth, async (user: User | null) => {
    if (user && cachedAccessToken) {
      if (onAuthSuccess) onAuthSuccess(user, cachedAccessToken);
    } else if (!user) {
      cachedAccessToken = null;
      if (onAuthFailure) onAuthFailure();
    }
  });
};

export const signInWithGoogle = async (): Promise<{ user: User; accessToken: string }> => {
  try {
    isSigningIn = true;
    const result = await signInWithPopup(auth, provider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    
    if (!credential?.accessToken) {
      throw new Error('No access token returned from Google Sign-In.');
    }

    cachedAccessToken = credential.accessToken;
    return { user: result.user, accessToken: cachedAccessToken };
  } catch (error: any) {
    console.error('Google Sign-In Error:', error);
    throw error;
  } finally {
    isSigningIn = false;
  }
};

export const getGoogleAccessToken = (): string | null => {
  return cachedAccessToken;
};

export const signOutGoogle = async () => {
  await signOut(auth);
  cachedAccessToken = null;
};

/**
 * Creates a brand-new Google Spreadsheet in the user's Google Drive
 * and populates it with Phase 0 plant observations.
 */
export const exportToGoogleSheets = async (
  observations: PlantObservation[],
  customTitle?: string
): Promise<{ spreadsheetId: string; spreadsheetUrl: string }> => {
  let token = cachedAccessToken;
  if (!token) {
    const authResult = await signInWithGoogle();
    token = authResult.accessToken;
  }

  const title = customTitle || `ONMOTIO_Mustard_Observations_${new Date().toISOString().split('T')[0]}`;

  // 1. Create Spreadsheet
  const createRes = await fetch('https://sheets.googleapis.com/v4/spreadsheets', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      properties: {
        title: title
      },
      sheets: [
        {
          properties: {
            title: 'Mustard_Pilot_Data',
            gridProperties: {
              frozenRowCount: 1
            }
          }
        }
      ]
    })
  });

  if (!createRes.ok) {
    const errText = await createRes.text();
    throw new Error(`Failed to create Google Sheet: ${createRes.status} ${errText}`);
  }

  const spreadsheetData = await createRes.json();
  const spreadsheetId = spreadsheetData.spreadsheetId;
  const spreadsheetUrl = spreadsheetData.spreadsheetUrl;

  // 2. Prepare Header & Rows
  const headers = [
    'Observation ID',
    'Date',
    'Time',
    'Group (Indoor/Outdoor)',
    'Soil Moisture (% VWC)',
    'Leaf Angle Deflection (Deg)',
    'Temperature (°C)',
    'Humidity (% RH)',
    'Light (Lux)',
    'Rhizosphere pH',
    'Metal Uptake (ppm)',
    'Target Metal',
    'Extracellular V_bio (mV)',
    'Stem Height (mm)',
    'Stress Score (1-5)',
    'Notes / Field Log'
  ];

  const rows = observations.map(obs => [
    obs.id,
    obs.date,
    obs.time,
    obs.group,
    obs.soilMoisturePct,
    obs.leafAngleDeg,
    obs.temperatureC,
    obs.humidityPct,
    obs.lightLux,
    obs.pH,
    obs.metalUptakePpm,
    obs.targetMetal || 'Nickel (Ni)',
    obs.biopotentialMv || '',
    obs.stemHeightMm,
    obs.stressScore,
    obs.notes
  ]);

  // 3. Append Data to Spreadsheet
  const appendRes = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/Mustard_Pilot_Data!A1:append?valueInputOption=USER_ENTERED`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        values: [headers, ...rows]
      })
    }
  );

  if (!appendRes.ok) {
    const errText = await appendRes.text();
    throw new Error(`Failed to populate Google Sheet: ${appendRes.status} ${errText}`);
  }

  return { spreadsheetId, spreadsheetUrl };
};
