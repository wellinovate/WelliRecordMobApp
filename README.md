# WelliRecord Mobile App

**WelliRecord** is a patient-owned, privacy-first mobile health record and care coordination application designed for modern healthcare ecosystems.

---

## 📱 Application Overview

WelliRecord gives patients total control over their clinical records, care journeys, and medical identities:
- **One Health Identity (WelliID):** A cryptographically verifiable, durable patient ID (`WR-4821-0936`) independent of physical phone hardware or SIM cards.
- **Offline Emergency Medical ID & QR:** Instant access to critical blood group (O+), genotype (AA), allergies (Penicillin), emergency contacts, and active conditions without cellular data or internet connectivity.
- **Health Records Vault:** Multi-source categorization (Laboratory reports, Prescriptions, Clinical notes, Imaging, Vitals, and Receipts) with cryptographic provenance badges.
- **AI-Assisted Document & Prescription Scanner:** Camera scanning for paper prescriptions, discharge slips, and lab tests with structured biomarker review before adding to the vault.
- **Smart Consent & Zero-Trust Sharing:** 24-hour revocable QR codes, granular scoped sharing, audit logging, and instant one-tap revocation.
- **Care Discovery & Consultation Booking:** Clinic discovery, appointment scheduling with doctor time slots, and queue check-in.
- **Medication Adherence:** Daily dose tracking (Amlodipine, Ferrous sulfate) with morning/evening schedules.
- **Multi-Language & Accessibility:** Support for English, Nigerian Pidgin, Hausa, Yoruba, and Igbo, alongside high contrast and scalable typography.

---

## 🏗️ Architecture

```
Build WelliRecord App Screens 2/
├── assets/                          # App icon, adaptive icon, splash screen, favicon
├── public/icons/                    # 154 extracted Figma SVG medical & UI assets
├── src/
│   ├── components/
│   │   ├── common/index.tsx         # Atomic UI primitives (Card, Badge, Row, Choice, Buttons)
│   │   ├── navigation/              # Header (back stack, title) & BottomTabBar (5-tab navigation)
│   │   └── simulator/               # MobileDeviceFrame (iPhone 16 Pro, Pixel 9, Responsive)
│   ├── constants/icons.ts           # Type-safe icon dictionary
│   ├── screens/                     # 15 modular screen bundles (40 complete Figma screens)
│   │   ├── AuthScreens.tsx          # Welcome, SignIn (Face ID), CreateAccount, VerifyPhone
│   │   ├── HomeScreen.tsx           # WelliID Card (#031f50), Quick Actions, Vitals
│   │   ├── RecordsScreen.tsx        # Categorized vault, uploads, provenance badges
│   │   ├── ReportsScreen.tsx        # SYNLAB lab panels & flagged biomarker values
│   │   ├── ResultScreen.tsx         # Haemoglobin clinical education & chat
│   │   ├── TimelineScreen.tsx       # Care timeline with provider provenance
│   │   ├── MedicationsScreen.tsx    # Amlodipine & Ferrous sulfate dose tracking
│   │   ├── CareBookingScreens.tsx   # Discovery, time selection, review, check-in
│   │   ├── ConsentAndPassportScreens.tsx # 24h QR grant, Emergency ID, Health Passport
│   │   ├── UploadAndChatScreens.tsx # Camera scan, PDF review, AI extraction, chat
│   │   ├── VaultAndOfflineScreens.tsx # Offline vault, cached emergency basics
│   │   ├── SecurityScreens.tsx      # Lost phone, account recovery & identity checks
│   │   ├── PreferencesScreen.tsx    # Multilingual & accessibility preferences
│   │   └── OutcomeScreen.tsx        # Revoke & shared grant confirmations
│   ├── services/                    # Production service layer
│   │   ├── offlineSyncService.ts    # Emergency ID offline caching & sync queue
│   │   ├── recordsService.ts        # Medical records CRUD & provenance
│   │   ├── medicationReminderService.ts # Dose schedules & adherence tracking
│   │   ├── sharingService.ts        # Time-bound 24h revocable QR links
│   │   ├── careService.ts           # Facility directory & appointments
│   │   └── config.ts                # App configuration
│   ├── utils/                       # Native hardware & cross-platform utilities
│   │   ├── biometrics.ts            # Face ID / Touch ID authentication
│   │   ├── mediaPicker.ts           # Camera document capture & file picker
│   │   ├── haptics.ts               # Haptic feedback for touches and confirmations
│   │   └── storage.ts               # Hardware-backed SecureStore with web fallback
│   ├── state/WelliContext.tsx       # Central state store (history, offline mode, emergency)
│   ├── types/navigation.ts          # Screen definitions & metadata
│   └── App.tsx                      # Clean root application router
├── app.json                         # Expo config (Bundle ID: com.wellirecord.app)
├── eas.json                         # EAS Build configuration (APK, AAB, iOS Simulator)
└── package.json                     # Scripts for web preview and native mobile builds
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 20+
- `pnpm` (or `npm`)
- Expo CLI (`npx expo`)

### 1. Installation
```bash
pnpm install
```

### 2. Run Interactive Mobile Studio (Web Preview)
To preview all 40 screens with device frame simulation (iPhone 16 Pro, Google Pixel 9, Responsive) and interactive controls:
```bash
pnpm run dev
```
Open [http://localhost:8443](http://localhost:8443) (or the port specified in terminal).

### 3. Run on Physical Device or Emulator (Expo Go)
```bash
pnpm start
```
- Scan the displayed QR code with your iOS Camera or Android Expo Go app.
- Press `i` to launch in the iOS Simulator.
- Press `a` to launch in the Android Emulator.

### 4. Build Standalone Android APK (EAS Build)
```bash
pnpm run build:apk
```

### 5. Production Web Bundle
```bash
pnpm run build
```

---

## 🔒 Security & Privacy Architecture
- **Hardware Enclave Biometrics:** Face ID and Touch ID integrate with the secure element.
- **Offline Emergency Vault:** Emergency details are cached locally in protected storage so emergency responders can access life-saving data during internet outages.
- **Time-Bound Consent:** All health record shares expire after 24 hours by default and can be revoked instantly at any point.
