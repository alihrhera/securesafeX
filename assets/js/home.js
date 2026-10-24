/* ===================== CONFIG ===================== */
const CONFIG = {
    // Waitlist API (server/). Local preview: `npm start` in server/ (port 8787). Live site: the API runs
    // on the same domain, so it's /api/waitlist. Opened as a file: no API, signups stay in this browser.
    endpoint: location.protocol === "file:" ? ""
        : ["localhost", "127.0.0.1"].includes(location.hostname) ? "http://localhost:8787/api/waitlist"
            : "/api/waitlist",
    variants: ["privacy", "security", "ease"]
};

/* ===================== COPY (EN / AR) ===================== */
const I18N = {
    en: {
        "meta.title": "SecureSafeX: the password manager you can hold",
        "meta.desc": "A pocket-sized hardware password manager. Your vault stays encrypted on the device: offline, no account, no cloud. Join the waitlist.",
        "lang.switch": "التبديل إلى العربية", "lang.label": "عربي",
        "theme.toLight": "Switch to light mode", "theme.toDark": "Switch to dark mode",
        "nav.cta": "Join the waitlist",
        "hero.eyebrow": "pre-launch · first batch",
        "hero.h1.privacy": "Your passwords belong in your pocket, not someone's cloud.",
        "hero.sub.privacy": "SecureSafeX is a pocket-sized password manager that keeps your vault encrypted on the device itself: offline, with no account, and out of reach of any server breach.",
        "hero.h1.security": "A password vault hackers can't reach over the internet.",
        "hero.sub.security": "Your vault stays encrypted inside a dedicated device, and you enter your PIN on the device, not your computer. Malware can't log your PIN, and there's no server to leak.",
        "hero.h1.ease": "Press one button and your password types itself.",
        "hero.sub.ease": "Plug in SecureSafeX, pick an account, and press. It types your login like a keyboard. Bring your passwords over from your current manager in minutes, with no subscription, no account, and no cloud.",
        "hero.alt": "The SecureSafeX device: a slim metal USB-C unit with a small screen showing a menu and four navigation buttons",
        "hero.tag": "working prototype",
        "scroll.hint": "scroll to look inside",
        "scroll.1.k": "01 · shell",
        "scroll.1.h": "Aluminium shell, real buttons",
        "scroll.1.p": "You unlock it and confirm each login on the device itself, not on your computer.",
        "scroll.2.k": "02 · main board",
        "scroll.2.h": "Types for you over USB-C",
        "scroll.2.p": "Plugged in, SecureSafeX acts like a keyboard and types the login you picked.",
        "scroll.3.k": "03 · secure chip",
        "scroll.3.h": "Your vault lives here",
        "scroll.3.p": "Your passwords stay encrypted on the device. No account, no copy on a server.",
        "scroll.4.k": "04 · battery",
        "scroll.4.h": "Charges over USB-C",
        "scroll.4.p": "A small built-in cell, charged from the same port.",
        "scroll.5.k": "nothing in the cloud",
        "scroll.5.h": "Small device. Your data, your control.",
        "scroll.5.p": "Everything you just saw stays in your pocket.",
        "hero.inside": "see inside", "hero.closeup": "close it up",
        "nav.label": "Sections",
        "open.render": "The four layers of the prototype pulled apart: aluminium shell with buttons, main board, secure chip and battery",
        "open.usb": "The braided USB-C cable and its plug, close to the device",
        "demo.alt": "A wall of vault tiles standing for a cloud manager's servers",
        "demo.cloud": "A cloud manager", "demo.you": "Your SecureSafeX",
        "demo.btn": "Simulate a breach", "demo.reset": "Reset the demo",
        "demo.hit": "Every vault on the wall is copied at once.", "demo.safe": "Nothing to copy. There's no server.",
        "demo.note": "An illustration, not real data.",
        "key.up": "Up", "key.down": "Down", "key.back": "Back", "key.ok": "Select",
        "trust.1": "No cloud", "trust.2": "No account", "trust.3": "No subscription",
        "problem.eyebrow": "the problem",
        "problem.h2": "Cloud password managers put everyone's vaults in one place",
        "problem.lead": "They're convenient, and they're encrypted. But they also mean your most sensitive data sits on servers you don't control, next to millions of other vaults.",
        "problem.c1.h": "One target, millions of vaults",
        "problem.c1.p": "A single server is worth attacking because of how much it holds. If encrypted vaults get copied, attackers can try to crack them offline for as long as they like.",
        "problem.c2.h": "You have to trust what you can't see",
        "problem.c2.p": "Their servers, their staff, their update pipeline, their next acquisition. You never see any of it, and your passwords depend on all of it.",
        "problem.c3.h": "Your access is a subscription",
        "problem.c3.p": "Miss a payment, get locked out of the account, or the service changes its terms, and getting into your own passwords gets harder.",
        "problem.callout": "This isn't hypothetical. In 2022, attackers stole encrypted customer vault backups from a major cloud password manager. Users with weak master passwords are still exposed today.",
        "how.screen": "Device screen showing a list of accounts with one selected, and a 2FA code",
        "how.eyebrow": "the alternative",
        "how.h2": "A password vault you can hold in your hand",
        "how.lead": "SecureSafeX is a small USB-C device that stores your passwords and 2FA codes encrypted on the device itself. There's no server, no account, and nothing to sync.",
        "how.s1.h": "Unlock it on the device", "how.s1.p": "You enter your PIN with the device's own buttons, so your computer never sees it.",
        "how.s2.h": "Pick the account", "how.s2.p": "Scroll to the login you need on the built-in screen.",
        "how.s3.h": "Press, and it types for you", "how.s3.p": "The device acts as a USB keyboard and types the username, the password, or both. No drivers, no app.",
        "why.eyebrow": "why people want it",
        "why.h2": "Private, secure, and easy to use",
        "why.lead": "Tap the one that matters most to you. It helps us decide what to build first.",
        "why.p.h": "Private: it stays offline", "why.p.1": "Your vault lives on the device, not on anyone's server", "why.p.2": "No account, no email, no tracking", "why.p.3": "Wi-Fi turns on only when you choose to manage your vault",
        "why.s.h": "Secure: built like a hardware wallet", "why.s.1": "AES-256 encryption on a dedicated chip", "why.s.2": "PIN entered on the device, so keyloggers can't capture it", "why.s.3": "Locks itself and clears memory when idle",
        "why.e.h": "Easy: works like a keyboard", "why.e.1": "Import from Bitwarden, 1Password, Chrome and others", "why.e.2": "Types your logins on any computer, with nothing to install", "why.e.3": "Built-in 2FA codes and a strong password generator",
        "why.vote": "This matters most to me", "why.voted": "Thanks, noted",
        "cmp.eyebrow": "compare", "cmp.h2": "How it compares",
        "cmp.col0": "Feature", "cmp.col1": "Cloud manager", "cmp.col2": "Notebook",
        "cmp.r1": "Where your vault lives", "cmp.r1a": "Company servers", "cmp.r1b": "A drawer", "cmp.r1c": "Encrypted, on the device",
        "cmp.r2": "Needs an online account", "cmp.r3": "Exposed by a company breach", "cmp.r3a": "Possibly", "cmp.r3c": "No, there's no server",
        "cmp.r4": "Fills in passwords for you", "cmp.r4c": "Yes, it types them over USB",
        "cmp.r5": "Safe if someone steals it", "cmp.r5a": "Depends on your master password", "cmp.r5c": "Encrypted and PIN-locked",
        "cmp.r6": "What you pay", "cmp.r6a": "A monthly subscription", "cmp.r6b": "Nothing", "cmp.r6c": "A one-time purchase",
        "yes": "Yes", "no": "No",
        "open.eyebrow": "the prototype",
        "open.h2": "The prototype already works. We're building the real thing.",
        "open.lead": "SecureSafeX started as a maker project on the ESP32-S3. Your signup tells us whether to turn it into a finished, enclosed product.",
        "open.s1": "Dedicated chip with hardware-accelerated encryption", "open.s2": "Shows up as a keyboard. No drivers needed.", "open.s3": "Generates your 2FA codes on the device",
        "open.video": "Watch the prototype demo",
        "faq.eyebrow": "questions", "faq.h2": "The questions people ask first",
        "faq.q1": "What happens if I lose it?", "faq.a1": "Whoever finds it gets an encrypted, PIN-locked device, not your passwords. To get your vault back, we're designing an encrypted backup, either to a second device or to an encrypted file you keep. When you sign up, you can tell us which one you'd prefer.",
        "faq.q2": "Is it really offline?", "faq.a2": "In daily use, yes. It talks to your computer only as a USB keyboard. Wi-Fi turns on only when you pick Manage mode to import or edit, and then it runs its own private hotspot between the device and your computer. It never sends your vault to a server. If you want, Wi-Fi can also set the clock that 2FA codes depend on.",
        "faq.q3": "How do my existing passwords get onto it?", "faq.a3": "Export a CSV file from your current manager (Bitwarden, 1Password, Chrome, and others), then import it through the companion browser extension while the device is in Manage mode. The device encrypts everything as it saves it.",
        "faq.q4": "Will it work with my phone?", "faq.a4": "It should work with anything that accepts a USB keyboard: Windows, macOS, Linux, and many Android phones and iPads with USB-C. We're testing compatibility now, and Bluetooth is on the roadmap.",
        "faq.q5": "Why should I trust a new device?", "faq.a5": "The design removes the biggest risk on purpose: there's no server holding your data, so there's nothing for us to leak. Your vault is encrypted on the device and locked with a PIN you enter on the device itself.",
        "faq.q6": "How much will it cost, and when will it ship?", "faq.a6": "We haven't set a price yet. What you tell us in the signup form will shape it. It will be a one-time purchase with no subscription, and people on the waitlist get first access to the first batch.",
        "join.eyebrow": "first batch", "join.h2": "Be first in line for SecureSafeX",
        "join.lead": "Join the waitlist and we'll email you once, when the first batch is ready. No spam, and you can unsubscribe anytime.",
        "footer.by": "by Ali Hrhera", "footer.privacy": "We only use your email for this waitlist. We never sell or share it.",
        "form.label": "Email address", "form.ph": "you@example.com", "form.btn": "Join the waitlist", "form.sending": "Joining…",
        "form.note": "Free to join. We'll email you once, when it ships.",
        "form.err": "Please enter a valid email address.", "form.err.net": "Something went wrong. Please try again.", "form.err.rate": "Too many attempts. Please wait a few minutes and try again.",
        "s2.title": "You're on the list.", "s2.sub": "Want to help shape it? These 4 questions are optional and take about 20 seconds.",
        "s2.q1": "Which of these best describes you?", "s2.q1.a": "I care a lot about privacy", "s2.q1.b": "I manage many work accounts", "s2.q1.c": "Developer / maker", "s2.q1.d": "I just want something simple", "s2.q1.e": "Buying for family or a team",
        "s2.q2": "Which features would you use? (pick any)", "s2.q2.a": "Offline vault", "s2.q2.b": "Auto-typing passwords", "s2.q2.c": "2FA codes", "s2.q2.d": "Import from my manager", "s2.q2.e": "Browser extension", "s2.q2.f": "Backup to a 2nd device", "s2.q2.g": "Bluetooth for phones",
        "s2.q3": "What would you pay for it, one time?", "s2.q3.lt50": "< $50", "s2.q3.50_80": "$50–80", "s2.q3.80_120": "$80–120", "s2.q3.gt120": "$120+",
        "s2.q4": "What would stop you from buying one?", "s2.q4.ph": "e.g. losing it, setup, price, trusting new hardware…",
        "s2.btn": "Send answers", "s2.done": "Thank you! This helps a lot."
    },
    ar: {
        "meta.title": "SecureSafeX: مدير كلمات المرور الذي تحمله في يدك",
        "meta.desc": "مدير كلمات مرور عتادي بحجم الجيب. خزنتك تبقى مشفّرة داخل الجهاز: بلا إنترنت، بلا حساب، بلا سحابة. انضم إلى قائمة الانتظار.",
        "lang.switch": "Switch to English", "lang.label": "EN",
        "theme.toLight": "التبديل إلى الوضع الفاتح", "theme.toDark": "التبديل إلى الوضع الداكن",
        "nav.cta": "انضم إلى قائمة الانتظار",
        "hero.eyebrow": "قبل الإطلاق · الدفعة الأولى",
        "hero.h1.privacy": "كلمات مرورك في جيبك، لا على سحابة أحد.",
        "hero.sub.privacy": "SecureSafeX جهاز بحجم الجيب يحفظ خزنة كلمات مرورك مشفّرة داخله. يعمل دون إنترنت، ودون حساب، وبعيدًا عن أي اختراق للخوادم.",
        "hero.h1.security": "خزنة كلمات مرور لا يصلها المخترقون عبر الإنترنت.",
        "hero.sub.security": "خزنتك تبقى مشفّرة داخل جهاز مخصّص، وتُدخل رمزك السري على الجهاز نفسه لا على حاسوبك. فلا تستطيع البرامج الخبيثة التقاطه، ولا يوجد خادم يمكن أن يُسرَّب منه شيء.",
        "hero.h1.ease": "ضغطة زر واحدة، وتُكتب كلمة المرور تلقائيًا.",
        "hero.sub.ease": "وصّل SecureSafeX، واختر الحساب، ثم اضغط؛ فيكتب بيانات الدخول كأنه لوحة مفاتيح. وانقل كلمات مرورك من مديرك الحالي في دقائق، دون اشتراك أو حساب أو سحابة.",
        "hero.alt": "جهاز SecureSafeX: جهاز معدني نحيف بمنفذ USB-C وشاشة صغيرة تعرض قائمة، وأربعة أزرار للتنقل",
        "hero.tag": "نموذج أولي يعمل فعليًا",
        "scroll.hint": "مرّر لترى ما بالداخل",
        "scroll.1.k": "01 · الهيكل",
        "scroll.1.h": "هيكل من الألومنيوم وأزرار حقيقية",
        "scroll.1.p": "تفتح القفل وتؤكد كل تسجيل دخول على الجهاز نفسه، لا على حاسوبك.",
        "scroll.2.k": "02 · اللوحة الرئيسية",
        "scroll.2.h": "يكتب عنك عبر USB-C",
        "scroll.2.p": "عند توصيله، يعمل SecureSafeX كلوحة مفاتيح ويكتب بيانات الدخول التي اخترتها.",
        "scroll.3.k": "03 · الشريحة الآمنة",
        "scroll.3.h": "هنا تعيش خزنتك",
        "scroll.3.p": "تبقى كلمات مرورك مشفّرة على الجهاز. لا حساب، ولا نسخة على أي خادم.",
        "scroll.4.k": "04 · البطارية",
        "scroll.4.h": "يُشحن عبر USB-C",
        "scroll.4.p": "بطارية صغيرة مدمجة تُشحن من المنفذ نفسه.",
        "scroll.5.k": "لا شيء على السحابة",
        "scroll.5.h": "جهاز صغير. بياناتك تحت سيطرتك.",
        "scroll.5.p": "كل ما رأيته للتو يبقى في جيبك.",
        "hero.inside": "شاهد من الداخل", "hero.closeup": "أعد التجميع",
        "nav.label": "الأقسام",
        "open.render": "الطبقات الأربع للنموذج الأولي منفصلة: الهيكل المعدني بأزراره، واللوحة الرئيسية، والشريحة الآمنة، والبطارية",
        "open.usb": "كابل USB-C المجدول ورأسه بجوار الجهاز",
        "demo.alt": "جدار من بلاطات الخزائن يمثّل خوادم مدير كلمات مرور سحابي",
        "demo.cloud": "مدير سحابي", "demo.you": "جهازك SecureSafeX",
        "demo.btn": "جرّب محاكاة اختراق", "demo.reset": "أعد المحاكاة",
        "demo.hit": "تُنسخ كل خزائن الجدار دفعة واحدة.", "demo.safe": "لا شيء يُنسخ. لا يوجد خادم.",
        "demo.note": "توضيح فقط وليست بيانات حقيقية.",
        "key.up": "أعلى", "key.down": "أسفل", "key.back": "رجوع", "key.ok": "اختيار",
        "trust.1": "بلا سحابة", "trust.2": "بلا حساب", "trust.3": "بلا اشتراك",
        "problem.eyebrow": "المشكلة",
        "problem.h2": "مديرات كلمات المرور السحابية تجمع خزائن الجميع في مكان واحد",
        "problem.lead": "صحيح أنها مريحة ومشفّرة، لكن أكثر بياناتك حساسيةً تبقى على خوادم لا تتحكم بها، إلى جانب ملايين الخزائن الأخرى.",
        "problem.c1.h": "هدف واحد يضم ملايين الخزائن",
        "problem.c1.p": "الخادم الواحد يستحق الهجوم لأنه يحمل الكثير. وإذا نُسخت الخزائن المشفّرة، يستطيع المهاجمون محاولة كسرها دون اتصال ومهما طال الوقت.",
        "problem.c2.h": "عليك أن تثق بما لا تراه",
        "problem.c2.p": "خوادمهم، وموظفوهم، وتحديثاتهم، والجهة التي قد تستحوذ عليهم لاحقًا. لا ترى شيئًا من ذلك، وكلمات مرورك تعتمد عليه كله.",
        "problem.c3.h": "وصولك مرهون باشتراك",
        "problem.c3.p": "إذا تأخرت في الدفع، أو قُفل حسابك، أو غيّرت الخدمة شروطها، يصبح الوصول إلى كلمات مرورك أصعب.",
        "problem.callout": "هذا ليس افتراضًا. في 2022 سرق مهاجمون نسخًا احتياطية مشفّرة من خزائن العملاء لدى مدير كلمات مرور سحابي كبير، وما زال أصحاب كلمات المرور الرئيسية الضعيفة معرّضين للخطر حتى اليوم.",
        "how.screen": "شاشة الجهاز تعرض قائمة حسابات مع تحديد أحدها ورمز تحقق ثنائي",
        "how.eyebrow": "البديل",
        "how.h2": "خزنة كلمات مرور تحملها في يدك",
        "how.lead": "SecureSafeX جهاز صغير بمنفذ USB-C يحفظ كلمات مرورك ورموز التحقق الثنائي مشفّرة داخله. لا خادم، ولا حساب، ولا شيء يُزامَن.",
        "how.s1.h": "افتحه من الجهاز نفسه", "how.s1.p": "تُدخل رمزك السري (PIN) بأزرار الجهاز، فلا يراه حاسوبك أبدًا.",
        "how.s2.h": "اختر الحساب", "how.s2.p": "تنقّل إلى الحساب الذي تريده على الشاشة المدمجة.",
        "how.s3.h": "اضغط، ودَعه يكتب عنك", "how.s3.p": "يعمل الجهاز كلوحة مفاتيح USB ويكتب اسم المستخدم أو كلمة المرور أو كليهما، دون تعريفات أو تطبيقات.",
        "why.eyebrow": "لماذا يريده الناس",
        "why.h2": "خاص، وآمن، وسهل الاستخدام",
        "why.lead": "اختر الأهم بالنسبة لك؛ فاختيارك يساعدنا على تحديد ما نبنيه أولًا.",
        "why.p.h": "خصوصية: يعمل دون إنترنت", "why.p.1": "خزنتك داخل الجهاز، لا على خادم أحد", "why.p.2": "لا حساب، ولا بريد إلكتروني، ولا تتبّع", "why.p.3": "لا تعمل شبكة Wi-Fi إلا حين تختار إدارة خزنتك",
        "why.s.h": "أمان: مصمَّم كمحافظ العملات الرقمية العتادية", "why.s.1": "تشفير AES-256 على شريحة مخصّصة", "why.s.2": "الرمز السري يُدخَل على الجهاز، فلا تلتقطه برامج تسجيل المفاتيح", "why.s.3": "يُقفَل تلقائيًا ويمسح ذاكرته عند الخمول",
        "why.e.h": "سهولة: يعمل كلوحة مفاتيح", "why.e.1": "استيراد من Bitwarden و1Password وChrome وغيرها", "why.e.2": "يكتب بيانات دخولك على أي حاسوب دون تثبيت أي شيء", "why.e.3": "رموز تحقق ثنائي مدمجة ومولّد كلمات مرور قوية",
        "why.vote": "هذا الأهم بالنسبة لي", "why.voted": "شكرًا، سُجّل اختيارك",
        "cmp.eyebrow": "مقارنة", "cmp.h2": "مقارنة سريعة",
        "cmp.col0": "الميزة", "cmp.col1": "مدير سحابي", "cmp.col2": "دفتر ورقي",
        "cmp.r1": "أين تُحفظ خزنتك", "cmp.r1a": "خوادم الشركة", "cmp.r1b": "في درج", "cmp.r1c": "مشفّرة داخل الجهاز",
        "cmp.r2": "يحتاج حسابًا على الإنترنت", "cmp.r3": "يتأثر باختراق الشركة", "cmp.r3a": "وارد", "cmp.r3c": "لا، لا يوجد خادم",
        "cmp.r4": "يملأ كلمات المرور عنك", "cmp.r4c": "نعم، يكتبها عبر USB",
        "cmp.r5": "آمن إذا سُرق", "cmp.r5a": "يعتمد على كلمة مرورك الرئيسية", "cmp.r5c": "مشفّر ومقفل برمز سري",
        "cmp.r6": "ماذا تدفع", "cmp.r6a": "اشتراك شهري", "cmp.r6b": "لا شيء", "cmp.r6c": "شراء لمرة واحدة",
        "yes": "نعم", "no": "لا",
        "open.eyebrow": "النموذج الأولي",
        "open.h2": "النموذج الأولي يعمل الآن، ونحن نبني المنتج النهائي.",
        "open.lead": "بدأ SecureSafeX مشروعًا مستقلًا على شريحة ESP32-S3، وتسجيلك هو ما يخبرنا إن كان علينا تحويله إلى منتج نهائي متكامل.",
        "open.s1": "شريحة مخصّصة مع تشفير مسرَّع عتاديًا", "open.s2": "يتعرّف عليه الحاسوب كلوحة مفاتيح، دون تعريفات", "open.s3": "يولّد رموز التحقق الثنائي على الجهاز",
        "open.video": "شاهد عرض النموذج الأولي",
        "faq.eyebrow": "أسئلة", "faq.h2": "أكثر الأسئلة شيوعًا",
        "faq.q1": "ماذا لو فقدته؟", "faq.a1": "من يجده يحصل على جهاز مشفّر ومقفل برمز سري، لا على كلمات مرورك. ولاسترجاع خزنتك نصمّم نسخة احتياطية مشفّرة، إما على جهاز ثانٍ أو في ملف مشفّر تحتفظ به. يمكنك أن تخبرنا عند التسجيل أيهما تفضّل.",
        "faq.q2": "هل هو فعلًا بلا إنترنت؟", "faq.a2": "في الاستخدام اليومي، نعم. يتصل بحاسوبك كلوحة مفاتيح USB فقط. ولا تعمل شبكة Wi-Fi إلا عندما تختار وضع الإدارة للاستيراد أو التعديل، وحينها يشغّل شبكة خاصة بينه وبين حاسوبك فقط، ولا يرسل خزنتك إلى أي خادم. ويمكنك أيضًا استخدامها لضبط الساعة التي تعتمد عليها رموز التحقق الثنائي إن أردت.",
        "faq.q3": "كيف أنقل كلمات مروري الحالية إليه؟", "faq.a3": "صدّر ملف CSV من مديرك الحالي (Bitwarden أو 1Password أو Chrome وغيرها)، ثم استورده عبر إضافة المتصفح المرافقة والجهاز في وضع الإدارة. يشفّر الجهاز كل شيء أثناء الحفظ.",
        "faq.q4": "هل يعمل مع هاتفي؟", "faq.a4": "يُفترض أن يعمل مع أي جهاز يقبل لوحة مفاتيح USB: ويندوز وماك ولينكس، وكثير من هواتف أندرويد وأجهزة iPad بمنفذ USB-C. نختبر التوافق الآن، والبلوتوث ضمن خطتنا.",
        "faq.q5": "لماذا أثق بجهاز جديد؟", "faq.a5": "التصميم يزيل الخطر الأكبر عمدًا: لا يوجد خادم يحمل بياناتك، فلا يوجد ما يمكن أن نسرّبه. وخزنتك مشفّرة على الجهاز ومقفلة برمز سري تُدخله على الجهاز نفسه.",
        "faq.q6": "كم سيكلّف ومتى سيصل؟", "faq.a6": "لم نحدّد السعر بعد، وإجاباتك في نموذج التسجيل ستحدّده. سيكون شراءً لمرة واحدة بلا اشتراك، ومن في قائمة الانتظار يحصلون على أولوية الوصول إلى الدفعة الأولى.",
        "join.eyebrow": "الدفعة الأولى", "join.h2": "كن من أوائل من يحصلون على SecureSafeX",
        "join.lead": "انضم إلى قائمة الانتظار وسنراسلك مرة واحدة عندما تجهز الدفعة الأولى. بلا رسائل مزعجة، ويمكنك إلغاء الاشتراك متى شئت.",
        "footer.by": "من Ali Hrhera", "footer.privacy": "نستخدم بريدك لقائمة الانتظار فقط، ولا نبيعه ولا نشاركه أبدًا.",
        "form.label": "البريد الإلكتروني", "form.ph": "you@example.com", "form.btn": "انضم إلى قائمة الانتظار", "form.sending": "جارٍ الانضمام…",
        "form.note": "الانضمام مجاني. سنراسلك مرة واحدة عند الإطلاق.",
        "form.err": "يرجى إدخال بريد إلكتروني صحيح.", "form.err.net": "حدث خطأ. يرجى المحاولة مرة أخرى.", "form.err.rate": "محاولات كثيرة. يرجى الانتظار بضع دقائق ثم المحاولة مرة أخرى.",
        "s2.title": "أنت الآن في القائمة.", "s2.sub": "هل تودّ مساعدتنا في تطويره؟ أربعة أسئلة اختيارية تستغرق نحو 20 ثانية.",
        "s2.q1": "أيّ هذه يصفك أكثر؟", "s2.q1.a": "تهمّني الخصوصية كثيرًا", "s2.q1.b": "أدير حسابات عمل كثيرة", "s2.q1.c": "مطوّر / صانع", "s2.q1.d": "أريد حلًا بسيطًا فقط", "s2.q1.e": "أشتري للعائلة أو لفريق",
        "s2.q2": "أيّ الميزات ستستخدم؟ (اختر ما تشاء)", "s2.q2.a": "خزنة بلا إنترنت", "s2.q2.b": "كتابة كلمات المرور تلقائيًا", "s2.q2.c": "رموز التحقق الثنائي", "s2.q2.d": "الاستيراد من مديري الحالي", "s2.q2.e": "إضافة المتصفح", "s2.q2.f": "نسخ احتياطي لجهاز ثانٍ", "s2.q2.g": "بلوتوث للهواتف",
        "s2.q3": "كم أنت مستعد لدفعه مقابله (مرة واحدة)؟", "s2.q3.lt50": "أقل من 2500 ج.م", "s2.q3.50_80": "من 2500 إلى 4000 ج.م", "s2.q3.80_120": "من 4000 إلى 6000 ج.م", "s2.q3.gt120": "أكثر من 6000 ج.م",
        "s2.q4": "ما الذي قد يمنعك من شرائه؟", "s2.q4.ph": "مثلًا: فقدانه، الإعداد، السعر، الثقة بجهاز جديد…",
        "s2.btn": "أرسل الإجابات", "s2.done": "شكرًا لك! هذا يساعدنا كثيرًا."
    }
};

/* ===================== STATE ===================== */
const store = {
    get(k) { try { return JSON.parse(localStorage.getItem(k)); } catch (e) { return null; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { } }
};
const params = new URLSearchParams(location.search);
const utm = {};
// Capped to the API's limits so an unusually long ad link can't get a signup rejected.
["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"].forEach(k => { if (params.get(k)) utm[k] = params.get(k).slice(0, 100); });

// Variant: ?v= wins (for ad-specific landing URLs), then the sticky stored value, then random.
let variant = params.get("v");
if (!CONFIG.variants.includes(variant)) variant = store.get("sx_variant");
if (!CONFIG.variants.includes(variant)) variant = CONFIG.variants[Math.floor(Math.random() * CONFIG.variants.length)];
store.set("sx_variant", variant);

let lang = params.get("lang") || store.get("sx_lang") || ((navigator.language || "").toLowerCase().startsWith("ar") ? "ar" : "en");
if (!I18N[lang]) lang = "en";

let votes = store.get("sx_votes") || [];
let signupEmail = store.get("sx_email");
// In Arabic, Latin brand names are wrapped in Unicode isolates (FSI…PDI) so punctuation and
// word order around them render correctly in RTL text.
const t = k => {
    const v = I18N[lang][k] ?? I18N.en[k] ?? k;
    return lang === "ar" ? v.replace(/SecureSafeX|Ali Hrhera/g, m => "\u2068" + m + "\u2069") : v;
};

/* ===================== ANALYTICS ===================== */
// Forwards to Plausible / GA4 / GTM if present. Every event carries variant + lang so you can split results.
function track(name, props = {}) {
    const p = { variant, lang, ...props };
    try {
        if (window.plausible) window.plausible(name, { props: p });
        if (window.gtag) window.gtag("event", name, p);
        if (window.dataLayer) window.dataLayer.push({ event: name, ...p });
    } catch (e) { }
    if (location.hostname === "localhost" || location.protocol === "file:") console.debug("[track]", name, p);
}

/* ===================== I18N ===================== */
function applyLang() {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    document.querySelectorAll("[data-i18n]").forEach(el => { el.textContent = t(el.dataset.i18n); });
    document.querySelectorAll("[data-i18n-ph]").forEach(el => { el.placeholder = t(el.dataset.i18nPh); });
    document.querySelectorAll("[data-i18n-alt]").forEach(el => { el.alt = t(el.dataset.i18nAlt); });
    document.querySelectorAll("[data-i18n-aria]").forEach(el => { el.setAttribute("aria-label", t(el.dataset.i18nAria)); });
    document.getElementById("hero-h1").textContent = t("hero.h1." + variant);
    document.getElementById("hero-sub").textContent = t("hero.sub." + variant);
    document.title = t("meta.title");
    document.querySelector('meta[name="description"]').content = t("meta.desc");
    const toggle = document.getElementById("lang-toggle"), label = document.getElementById("lang-label");
    label.textContent = t("lang.label");
    label.lang = lang === "ar" ? "en" : "ar";
    toggle.setAttribute("aria-label", t("lang.switch"));
    updateThemeButton();
    // Layer names read "01 · shell": the captions already arrive in order, so only the part name is shown.
    document.querySelectorAll(".cap-k").forEach(el => { el.textContent = el.textContent.replace(/^[0-9\u0660-\u0669]+\s*·\s*/, ""); });
    // Comparison cells carry their column name for the stacked mobile layout.
    const heads = [...document.querySelectorAll("#compare thead th")].map(h => h.textContent.trim());
    document.querySelectorAll("#compare tbody tr").forEach(tr => [...tr.children].forEach((cell, i) => { if (cell.tagName === "TD") cell.dataset.l = heads[i]; }));
    document.querySelectorAll(".done-msg span").forEach(el => { el.textContent = t("s2.title") + " " + t("s2.done"); });
    document.querySelectorAll(".vote").forEach(b => {
        b.querySelector("span").textContent = t(b.getAttribute("aria-pressed") === "true" ? "why.voted" : "why.vote");
    });
}
document.getElementById("lang-toggle").addEventListener("click", () => {
    lang = lang === "ar" ? "en" : "ar";
    store.set("sx_lang", lang);
    // Keep the URL shareable in the chosen language.
    const u = new URL(location.href); u.searchParams.set("lang", lang); history.replaceState(null, "", u);
    applyLang();
    track("lang_switch", { to: lang });
});

/* ===================== THEME ===================== */
// The head script already applied the saved theme (or the OS one) before first paint.
const themeMeta = document.querySelector('meta[name="theme-color"]');
const currentTheme = () => document.documentElement.getAttribute("data-theme") === "light" ? "light" : "dark";
function setTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    if (themeMeta) themeMeta.content = theme === "light" ? "#ffffff" : "#121418";
    updateThemeButton();
}
function updateThemeButton() {
    document.getElementById("theme-toggle").setAttribute("aria-label", t(currentTheme() === "light" ? "theme.toDark" : "theme.toLight"));
}
document.getElementById("theme-toggle").addEventListener("click", () => {
    const next = currentTheme() === "light" ? "dark" : "light";
    store.set("sx_theme", next);
    setTheme(next);
    track("theme_switch", { to: next });
});
// Until the visitor picks a theme, keep following the OS setting.
const osTheme = matchMedia("(prefers-color-scheme: light)");
const followOs = e => { if (!store.get("sx_theme")) setTheme(e.matches ? "light" : "dark"); };
// Safari < 14 only has the older addListener(); a throw here would stop the signup forms from mounting.
if (osTheme.addEventListener) osTheme.addEventListener("change", followOs); else if (osTheme.addListener) osTheme.addListener(followOs);

/* ===================== LEAD PILLAR ===================== */
// The pillar matching the hero angle goes first so the page tells one consistent story.
(function () {
    const wrap = document.getElementById("pillars");
    const lead = wrap.querySelector(`[data-pillar="${variant}"]`);
    if (lead) { lead.classList.add("lead"); wrap.prepend(lead); }
})();

/* ===================== VOTES ===================== */
document.querySelectorAll(".vote").forEach(btn => {
    const key = btn.dataset.vote;
    if (votes.includes(key)) btn.setAttribute("aria-pressed", "true");
    btn.addEventListener("click", () => {
        const on = btn.getAttribute("aria-pressed") !== "true";
        btn.setAttribute("aria-pressed", String(on));
        votes = on ? [...new Set([...votes, key])] : votes.filter(v => v !== key);
        store.set("sx_votes", votes);
        btn.querySelector("span").textContent = t(on ? "why.voted" : "why.vote");
        track("pillar_vote", { pillar: key, on });
    });
});

/* ===================== SUBMIT ===================== */
// Mirrors normalizeEmail() in server/src/validate.js so people see problems before a round trip.
// The server re-checks everything; this is only for feedback.
function normalizeEmail(value) {
    const email = String(value || "").trim().toLowerCase();
    if (email.length < 6 || email.length > 254) return null;
    const at = email.indexOf("@");
    if (at < 1 || at !== email.lastIndexOf("@")) return null;
    const local = email.slice(0, at), labels = email.slice(at + 1).split(".");
    if (local.length > 64 || !/^[a-z0-9_%+-]+(?:\.[a-z0-9_%+-]+)*$/.test(local)) return null;
    if (labels.length < 2 || !labels.every(l => /^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/.test(l))) return null;
    return /^(?:[a-z]{2,63}|xn--[a-z0-9-]{1,59})$/.test(labels[labels.length - 1]) ? email : null;
}

// Referring page without query string or fragment (they can carry other people's tokens).
function referrerUrl() {
    try { const r = new URL(document.referrer); return /^https?:$/.test(r.protocol) ? (r.origin + r.pathname).slice(0, 500) : null; }
    catch (_) { return null; }
}

async function send(payload) {
    const record = { ...payload, variant, lang, votes, utm, referrer: referrerUrl() };
    if (!CONFIG.endpoint) {
        // No API configured (static preview): keep a copy in this browser only.
        const local = store.get("sx_waitlist_local") || [];
        local.push({ ...record, ts: new Date().toISOString() }); store.set("sx_waitlist_local", local);
        return { ok: true };
    }
    return post(record);
}

// text/plain keeps this a simple CORS request (no preflight); the API parses it as JSON.
async function post(record) {
    const res = await fetch(CONFIG.endpoint, { method: "POST", headers: { "Content-Type": "text/plain;charset=utf-8" }, body: JSON.stringify(record) });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw Object.assign(new Error(data.error || "request_failed"), { status: res.status });
    return data;
}

// Signups made while the page had no API address were kept in this browser only. Send them once
// now that it has one, then clear them. The server ignores repeat emails, so a resend is harmless.
async function flushLocalQueue() {
    const queue = store.get("sx_waitlist_local");
    if (!CONFIG.endpoint || !Array.isArray(queue) || !queue.length) return;
    const tokens = {};
    for (const { ts, ...record } of queue) {
        if (record.stage === "details") {
            record.token = tokens[record.email];
            if (!record.token) continue; // answers need the token from that email's signup
        }
        try {
            const data = await post(record);
            if (record.stage === "signup" && data.token) {
                tokens[record.email] = data.token;
                if (record.email === signupEmail) store.set("sx_token", data.token);
            }
        } catch (e) {
            if (!e.status || e.status === 429 || e.status >= 500) return; // offline or busy: keep the queue for next visit
        }
    }
    store.set("sx_waitlist_local", null);
}

let fieldSeq = 0;
function mountEmail(slot) {
    const node = document.getElementById("tpl-email").content.cloneNode(true);
    const form = node.querySelector("form");
    const input = form.querySelector("input");
    const id = "email-" + slot.dataset.formSlot;
    input.id = id; form.querySelector("label").htmlFor = id;
    const err = form.querySelector(".form-error");
    input.setAttribute("aria-describedby", id + "-err"); err.id = id + "-err";
    input.addEventListener("focus", () => track("form_focus", { loc: slot.dataset.formSlot }), { once: true });
    form.addEventListener("submit", async e => {
        e.preventDefault();
        const email = normalizeEmail(input.value);
        if (!email) {
            input.setAttribute("aria-invalid", "true"); err.textContent = t("form.err"); input.focus(); return;
        }
        input.removeAttribute("aria-invalid"); err.textContent = "";
        const btn = form.querySelector("button");
        btn.disabled = true; btn.textContent = t("form.sending");
        try {
            const res = await send({ stage: "signup", email, loc: slot.dataset.formSlot, website: form.querySelector('[name="website"]').value });
            signupEmail = email; store.set("sx_email", email);
            if (res.token) store.set("sx_token", res.token); // proves step 2 comes from the same person
            track("waitlist_signup", { loc: slot.dataset.formSlot });
            document.querySelectorAll("[data-form-slot]").forEach(s => mountDetails(s));
            slot.querySelector("form")?.querySelector("input,button")?.focus();
        } catch (e) {
            err.textContent = t(e.status === 429 ? "form.err.rate" : e.status === 400 ? "form.err" : "form.err.net");
            btn.disabled = false; btn.textContent = t("form.btn");
        }
    });
    slot.replaceChildren(node);
}

function mountDetails(slot) {
    if (store.get("sx_details_done")) { slot.innerHTML = `<p class="done-msg"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg><span>${t("s2.title")} ${t("s2.done")}</span></p>`; return; }
    const html = document.getElementById("tpl-details").innerHTML.replaceAll("FIELDID", String(++fieldSeq));
    slot.innerHTML = html;
    slot.querySelectorAll("[data-i18n]").forEach(el => { el.textContent = t(el.dataset.i18n); });
    slot.querySelectorAll("[data-i18n-ph]").forEach(el => { el.placeholder = t(el.dataset.i18nPh); });
    const form = slot.querySelector("form");
    form.addEventListener("submit", async e => {
        e.preventDefault();
        const fd = new FormData(form);
        const details = { persona: fd.get("persona"), features: fd.getAll("features"), price: fd.get("price"), worry: (fd.get("worry") || "").trim() };
        const btn = form.querySelector("button[type=submit]"); btn.disabled = true;
        try { await send({ stage: "details", email: signupEmail, token: store.get("sx_token"), ...details }); } catch (_) { }
        store.set("sx_details_done", true);
        track("waitlist_details", { persona: details.persona || "none", features: details.features.join(","), price: details.price || "none", has_worry: !!details.worry });
        document.querySelectorAll("[data-form-slot]").forEach(s => mountDetails(s));
    });
}

document.querySelectorAll("[data-form-slot]").forEach(slot => signupEmail ? mountDetails(slot) : mountEmail(slot));
flushLocalQueue();

/* ===================== ENGAGEMENT TRACKING ===================== */
document.querySelectorAll("[data-track]").forEach(el => el.addEventListener("click", () => track(el.dataset.track, { loc: el.dataset.trackLoc })));
document.querySelectorAll("details[data-faq]").forEach(d => d.addEventListener("toggle", () => { if (d.open) track("faq_open", { q: d.dataset.faq }); }));

const seen = new Set();
const io = new IntersectionObserver(entries => entries.forEach(en => {
    if (en.isIntersecting && !seen.has(en.target.dataset.section)) { seen.add(en.target.dataset.section); track("section_view", { section: en.target.dataset.section }); }
}), { threshold: .35 });
document.querySelectorAll("[data-section]").forEach(s => io.observe(s));

// Sticky CTA on mobile: shown after the hero, hidden once the final form is visible.
const sticky = document.getElementById("sticky-cta");
let heroOut = false, joinIn = false, pinned = false;
const upd = () => { const show = heroOut && !joinIn && !pinned && !signupEmail; sticky.classList.toggle("show", show); sticky.setAttribute("aria-hidden", String(!show)); sticky.querySelector("a").tabIndex = show ? 0 : -1; };
new IntersectionObserver(([e]) => { heroOut = !e.isIntersecting; upd(); }).observe(document.querySelector(".hero-copy-wrap"));
new IntersectionObserver(([e]) => { joinIn = e.isIntersecting; upd(); }).observe(document.getElementById("join"));
// While the pinned 3D stage is on screen it carries its own call to action (mobile captions sit where this bar does).
new IntersectionObserver(([e]) => { pinned = e.isIntersecting; upd(); }).observe(document.querySelector(".scroll-track"));

/* ===================== THE TILE X ===================== */
// The name's letter drawn as banna'i staircase diagonals: three tiles wide, the crossing tile is gold
// (yours) and sits behind the device. Same cell grid as the vault wall below.
document.querySelectorAll(".tile-x").forEach(svg => {
    const n = 15, mid = (n - 1) / 2; let out = "";
    for (let r = 0; r < n; r++) for (let q = 0; q < n; q++) {
        const d = Math.min(Math.abs(q - r), Math.abs(q + r - (n - 1)));
        if (d > 1) continue;
        const cls = r === mid && q === mid ? "xg" : d === 0 ? "xa" : "xb";
        out += `<rect class="${cls}" x="${q + .06}" y="${r + .06}" width=".88" height=".88"/>`;
    }
    svg.innerHTML = out;
});

// While the 3D hero is pinned the X follows the device: same ramps, same easing as securex-scroll.js.
(function () {
    const hero = document.querySelector("[data-scroll-hero]");
    const track = hero && hero.querySelector(".scroll-track");
    if (!track || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ramp = (x, a, b) => { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t); };
    const wide = matchMedia("(min-width: 901px)");
    const forced = /#p=([\d.]+)/.exec(location.hash); // review hook shared with securex-scroll.js
    let p = forced ? Number(forced[1]) : 0, visible = true;
    new IntersectionObserver(([en]) => { visible = en.isIntersecting; }).observe(track);
    (function frame() {
        if (visible && hero.classList.contains("scroll-3d")) {
            const r = track.getBoundingClientRect(), span = r.height - innerHeight;
            if (!forced) p += ((span > 0 ? Math.min(1, Math.max(0, -r.top / span)) : 0) - p) * 0.14;
            const a = ramp(p, 0.04, 0.3), e = ramp(p, 0.34, 0.58) * (1 - ramp(p, 0.86, 0.98));
            const side = document.documentElement.dir === "rtl" ? -1 : 1;
            hero.style.setProperty("--xs", wide.matches ? (side * (0.22 * (1 - a) + 0.1 * e)).toFixed(4) : "0");
            hero.style.setProperty("--xe", e.toFixed(3));
        }
        requestAnimationFrame(frame);
    })();
})();

/* ===================== THE WALL OF VAULTS (live demo) ===================== */
// A cloud manager is one wall of everyone's vaults: breach it and every tile goes at once, in a wave
// from one cell. The gold tile, yours, is not on the wall. Illustration only; the counts are tiles.
(function () {
    const box = document.getElementById("breach"), wall = document.getElementById("vaults");
    if (!box || !wall) return;
    const btn = document.getElementById("breach-btn"), wallState = document.getElementById("wall-state"), youState = document.getElementById("you-state");
    const narrow = matchMedia("(max-width: 900px)");
    let cols = 0;
    function build() {
        const c = narrow.matches ? 14 : 24, rows = narrow.matches ? 9 : 10;
        if (c === cols) return; cols = c;
        wall.style.setProperty("--cols", c);
        wall.replaceChildren(...Array.from({ length: c * rows }, () => document.createElement("i")));
        aim();
    }
    // Each breach starts from a different cell; --d is how many steps a tile is from it.
    function aim() {
        const c = cols, cells = [...wall.children], rows = cells.length / c;
        const ox = Math.floor(Math.random() * c), oy = Math.floor(Math.random() * rows);
        cells.forEach((cell, i) => cell.style.setProperty("--d", Math.round(Math.hypot((i % c) - ox, Math.floor(i / c) - oy))));
    }
    function paint() {
        const hit = box.classList.contains("hit");
        btn.textContent = t(hit ? "demo.reset" : "demo.btn");
        wallState.textContent = hit ? t("demo.hit") : "";
        youState.textContent = hit ? t("demo.safe") : "";
    }
    btn.addEventListener("click", () => {
        if (!box.classList.contains("hit")) aim();
        const hit = box.classList.toggle("hit");
        paint();
        if (hit) track("breach_demo");
    });
    narrow.addEventListener ? narrow.addEventListener("change", build) : narrow.addListener(build);
    build();
    document.getElementById("lang-toggle").addEventListener("click", paint);
    paint();
})();

/* ===================== THE DEVICE (working keys) ===================== */
(function () {
    const dev = document.querySelector(".device");
    if (!dev) return;
    const rows = [...dev.querySelectorAll(".oled .row")];
    let i = rows.findIndex(r => r.classList.contains("sel")), typing = 0;
    const label = rows.map(r => r.textContent);
    const show = n => { i = (n + rows.length) % rows.length; rows.forEach((r, k) => { r.classList.toggle("sel", k === i); r.textContent = label[k]; }); };
    dev.querySelector(".key-up").addEventListener("click", () => { clearTimeout(typing); dev.classList.remove("typed"); show(i - 1); });
    dev.querySelector(".key-down").addEventListener("click", () => { clearTimeout(typing); dev.classList.remove("typed"); show(i + 1); });
    dev.querySelector(".key-back").addEventListener("click", () => { clearTimeout(typing); dev.classList.remove("typed"); show(0); });
    // Select "types" the login: the row shows the dots a keyboard would send, the LED turns gold, then it resets.
    dev.querySelector(".key-ok").addEventListener("click", () => {
        clearTimeout(typing); dev.classList.add("typed"); rows[i].textContent = "\u2022 \u2022 \u2022 \u2022 \u2022 \u2022 \u2022 \u2022";
        typing = setTimeout(() => { dev.classList.remove("typed"); show(i); }, 1400);
    });
    // Idle: walk the selection down the list until a visitor takes over (skipped for reduced motion).
    if (!matchMedia("(prefers-reduced-motion: reduce)").matches) {
        const walk = setInterval(() => { if (!dev.classList.contains("typed")) show(i + 1); }, 2200);
        dev.addEventListener("pointerdown", () => clearInterval(walk), { once: true });
        dev.addEventListener("focusin", () => clearInterval(walk), { once: true });
    }
})();

/* ===================== FRIEZE ===================== */
// A two-row band of the glazed wall between sections: a diamond lattice of lighter tiles on cobalt.
(function () {
    const bands = [...document.querySelectorAll(".frieze")];
    if (!bands.length) return;
    let lastW = 0;
    function build() {
        const w = document.documentElement.clientWidth;
        if (w === lastW) return; lastW = w;
        const size = Math.round(Math.min(52, Math.max(28, w * 0.034)));
        const cols = Math.max(4, Math.floor((w + 4) / (size + 4)));
        bands.forEach(band => {
            band.style.setProperty("--ft", size + "px");
            band.style.gridTemplateColumns = `repeat(${cols}, ${size}px)`;
            band.replaceChildren(...Array.from({ length: cols * 2 }, (_, i) => {
                const r = Math.floor(i / cols), q = i % cols, cell = document.createElement("i");
                if ((q + r) % 4 === 0 || ((q - r) % 4 + 4) % 4 === 0) cell.className = "a";
                return cell;
            }));
        });
    }
    build();
    addEventListener("resize", () => { lastW = 0; build(); });
})();

/* ===================== REVEAL ===================== */
// Parts arrive once as they enter; without script (or with reduced motion) everything is simply there.
(function () {
    const els = [...document.querySelectorAll(".rv")];
    if (!("IntersectionObserver" in window)) { els.forEach(e => e.classList.add("in")); return; }
    const io2 = new IntersectionObserver(entries => entries.forEach(en => {
        if (!en.isIntersecting) return;
        io2.unobserve(en.target); en.target.classList.add("in");
    }), { threshold: .12, rootMargin: "0px 0px -6% 0px" });
    els.forEach(e => {
        const sib = [...e.parentElement.children].filter(x => x.classList.contains("rv"));
        e.style.setProperty("--i", Math.min(sib.indexOf(e), 4));
        io2.observe(e);
    });
})();

applyLang();
track("page_view", { utm_source: utm.utm_source || "direct" });
