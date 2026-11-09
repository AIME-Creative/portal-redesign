/* ============================================================
   AMP — portal content (lenders, Market products, Vault resources, events)
   ------------------------------------------------------------
   GENERATED from the production AMP Supabase project — the same
   items members see in the live portal today. Don't hand-edit:
   re-export and regenerate when the content changes.
   - Lenders: every active lender; tier = its category
     (Title/Platinum, Gold, Silver, Bronze, Fuse Flex, AIME Capital).
   - Market: every active vendor product. Products listed once per
     tier (variant) show the member only the one for their tier.
   - Resources: a representative slice of the library (latest
     episodes of each show, webinars, trainings, downloads) up to
     the prototype's "today" (Jun 25, 2026).
   - Events: the real events; placeholder events for new features
     (event registration, VIP-only) are added in app.js / admin.js.
   Contact details (emails, phone numbers, private meeting links)
   are stripped — the prototype is public.
   Shown durations are publish dates: production has no durations.
   Loaded before app.js (member) and admin.js (admin).
   ============================================================ */
window.AMP_CONTENT = {
"source":"AMP Supabase (project AMP), exported Nov 9, 2026",
"lenders":[
{
"name":"United Wholesale Mortgage",
"short":"UWM",
"tier":"Title/Platinum",
"color":"#0b1f5b",
"desc":"Headquartered in Pontiac, Michigan, United Wholesale Mortgage (UWM) is the #1 wholesale lender in the nation six years in a row, providing state-of-the-art technology and unrivaled client service. UWM is known for its highly efficient, accurate, and expeditious lending support. UWM underwrites and provides closing documentation for residential mortgage loans originated by independent mortgage brokers, correspondents, small banks and local credit unions. UWM's exceptional teamwork and laser-like focus on delivering innovative mortgage solutions are driving the company's ongoing growth and its leadership position as the foremost advocate for mortgage brokers.",
"body":[
"Headquartered in Pontiac, Michigan, United Wholesale Mortgage (UWM) is the #1 wholesale lender in the nation six years in a row, providing state-of-the-art technology and unrivaled client service. UWM is known for its highly efficient, accurate, and expeditious lending support. UWM underwrites and provides closing documentation for residential mortgage loans originated by independent mortgage brokers, correspondents, small banks and local credit unions. UWM's exceptional teamwork and laser-like focus on delivering innovative mortgage solutions are driving the company's ongoing growth and its leadership position as the foremost advocate for mortgage brokers."
],
"tags":[
"Conventional",
"DSCR",
"FHA",
"VA",
"USDA",
"Jumbo"
],
"featured":false,
"logo":"assets/content/lenders/united-wholesale-mortgage.png"
},
{
"name":"Windsor Mortgage",
"short":"WM",
"tier":"Gold",
"color":"#1b7a4a",
"desc":"At Windsor, we understand that mortgage is complicated, but we love it. It’s what we do. We’re passionate about helping you be good at mortgage. Whether you’re a community bank, broker or correspondent partner, Windsor provides you with the tools and resources to be successful. From day one, you’re given an inside team of dedicated mortgage experts. The team works with you directly to strengthen relationships with customers. They are an extension of your staff, but without the overhead. At Windsor, we’re real people, who believe in real conversations, real relationships and personalized solutions.",
"body":[
"At Windsor, we understand that mortgage is complicated, but we love it. It’s what we do. We’re passionate about helping you be good at mortgage. Whether you’re a community bank, broker or correspondent partner, Windsor provides you with the tools and resources to be successful. From day one, you’re given an inside team of dedicated mortgage experts. The team works with you directly to strengthen relationships with customers. They are an extension of your staff, but without the overhead. At Windsor, we’re real people, who believe in real conversations, real relationships and personalized solutions."
],
"tags":[
"Bridge Loans",
"Conventional",
"FHA",
"Jumbo",
"USDA",
"VA",
"Doctor Loan"
],
"featured":false,
"logo":"assets/content/lenders/windsor-mortgage.png"
},
{
"name":"Equity Prime Mortgage LLC",
"short":"EPM",
"tier":"Silver",
"color":"#3a3a3a",
"desc":"Equity Prime Mortgage (EPM) is a leading national mortgage lender dedicated to empowering homeownership through innovative lending solutions and exceptional service. Founded in 2008 and headquartered in Atlanta, Georgia, EPM offers a wide range of residential loan products—including conventional, FHA, VA, USDA, non-QM, and investor-focused programs. With a mission to preserve, promote, and protect the American dream of homeownership, EPM serves the wholesale channel with a commitment to integrity, education, and community.",
"body":[
"Equity Prime Mortgage (EPM) is a leading national mortgage lender dedicated to empowering homeownership through innovative lending solutions and exceptional service. Founded in 2008 and headquartered in Atlanta, Georgia, EPM offers a wide range of residential loan products—including conventional, FHA, VA, USDA, non-QM, and investor-focused programs. With a mission to preserve, promote, and protect the American dream of homeownership, EPM serves the wholesale channel with a commitment to integrity, education, and community."
],
"tags":[
"Conventional",
"FHA",
"Jumbo",
"Non-QM",
"USDA",
"VA",
"Seconds"
],
"featured":false,
"logo":"assets/content/lenders/equity-prime-mortgage-llc.png"
},
{
"name":"Newrez LLC",
"short":"NL",
"tier":"Silver",
"color":"#e0463c",
"desc":"Newrez Wholesale is built for mortgage brokers who want more – more support, more products, more loan protections, and more ways to grow. We help you win more business with full suite of Conventional, Government, Non-QM, and Jumbo solutions, backed by fast turn times, knowledgeable and responsive AEs, and a dedicated Operations team that you have direct access to. Partner with Newrez Wholesale and discover what a true broker-first experience looks like.",
"body":[
"Newrez Wholesale is built for mortgage brokers who want more – more support, more products, more loan protections, and more ways to grow. We help you win more business with full suite of Conventional, Government, Non-QM, and Jumbo solutions, backed by fast turn times, knowledgeable and responsive AEs, and a dedicated Operations team that you have direct access to. Partner with Newrez Wholesale and discover what a true broker-first experience looks like."
],
"tags":[
"Conventional",
"FHA",
"Jumbo",
"Non-QM",
"USDA",
"VA",
"Seconds"
],
"featured":true,
"logo":"assets/content/lenders/newrez-llc.png"
},
{
"name":"Cake Mortgage",
"short":"CM",
"tier":"Silver",
"color":"#163a85",
"desc":"At Cake, we specialize in offering wholesale mortgage products to our brokers. We provide a wide range of loan options, including conventional, FHA, VA, jumbo loans and Non-QM, tailored to meet the unique needs of your clients across diverse backgrounds and financial situations. Our team of experienced professionals is dedicated to delivering personalized service and expert guidance throughout the entire loan process. We work closely with our partners to ensure you have access to competitive rates, flexible underwriting, and innovative technology that streamlines the application and closing processes. Integrity and transparency are at the core of our operations. We believe in building strong relationships with our brokers based on trust, reliability, and open communication. Our commitment to excellence and adherence to industry best practices have earned us a reputation as a trusted wholesale mortgage lender. Cake is proud to be at the forefront of the mortgage industry, leveraging our expertise and cutting-edge technology to deliver superior lending solutions.",
"body":[
"At Cake, we specialize in offering wholesale mortgage products to our brokers. We provide a wide range of loan options, including conventional, FHA, VA, jumbo loans and Non-QM, tailored to meet the unique needs of your clients across diverse backgrounds and financial situations. Our team of experienced professionals is dedicated to delivering personalized service and expert guidance throughout the entire loan process. We work closely with our partners to ensure you have access to competitive rates, flexible underwriting, and innovative technology that streamlines the application and closing processes. Integrity and transparency are at the core of our operations. We believe in building strong relationships with our brokers based on trust, reliability, and open communication. Our commitment to excellence and adherence to industry best practices have earned us a reputation as a trusted wholesale mortgage lender. Cake is proud to be at the forefront of the mortgage industry, leveraging our expertise and cutting-edge technology to deliver superior lending solutions."
],
"tags":[
"Bank Statement",
"WVOE Only",
"P&L",
"DSCR",
"Conventional",
"FHA",
"Jumbo",
"Non-QM",
"VA",
"USDA",
"HELOC"
],
"featured":false,
"logo":"assets/content/lenders/cake-mortgage.png"
},
{
"name":"eLend",
"short":"ELEN",
"tier":"Silver",
"color":"#2bb673",
"desc":"eLend is dedicated to helping clients bring families home. In addition to offering unique lending products, eLend fully invests in the success of its business partners by providing industry-leading technology, professional expertise and continuous opportunities for education. eLend remains committed to the success and support of our independent mortgage brokers and we look forward to guiding brokers through opportunities for new business with our unique programs and industry expertise.",
"body":[
"eLend is dedicated to helping clients bring families home. In addition to offering unique lending products, eLend fully invests in the success of its business partners by providing industry-leading technology, professional expertise and continuous opportunities for education. eLend remains committed to the success and support of our independent mortgage brokers and we look forward to guiding brokers through opportunities for new business with our unique programs and industry expertise."
],
"tags":[
"Conventional",
"FHA",
"Jumbo",
"Non-QM",
"VA",
"USDA",
"HELOC"
],
"featured":true,
"logo":"assets/content/lenders/elend.png"
},
{
"name":"RCN Capital",
"short":"RC",
"tier":"Silver",
"color":"#1893b1",
"desc":"RCN Capital is a nationwide, direct, private lender. We provide investment-purpose loans for the purchase or refinance of non-owner-occupied single-family & multi-family properties. We specialize in ground-up construction financing, short-term bridge loans, fix & flip financing as well as long-term rental financing for real estate investors. We lend to both new and experienced real estate professionals throughout the country. As the nation’s premier direct private lender, RCN Capital helps fill this void. As a direct, private lender, RCN Capital takes a common-sense approach to underwriting, with all approvals made in-house. We are dedicated to providing quick responses to time-sensitive loans, often times with the ability to close in as few as 10 business days. At RCN Capital, we value referrals and our brokers are protected. We are committed to the highest level of customer service, because our success lies in building relationships.",
"body":[
"RCN Capital is a nationwide, direct, private lender. We provide investment-purpose loans for the purchase or refinance of non-owner-occupied single-family & multi-family properties. We specialize in ground-up construction financing, short-term bridge loans, fix & flip financing as well as long-term rental financing for real estate investors. We lend to both new and experienced real estate professionals throughout the country. As the nation’s premier direct private lender, RCN Capital helps fill this void. As a direct, private lender, RCN Capital takes a common-sense approach to underwriting, with all approvals made in-house. We are dedicated to providing quick responses to time-sensitive loans, often times with the ability to close in as few as 10 business days. At RCN Capital, we value referrals and our brokers are protected. We are committed to the highest level of customer service, because our success lies in building relationships."
],
"tags":[
"Construction",
"Fix n Flip",
"Short Term Rental",
"Long Term Rental"
],
"featured":false,
"logo":"assets/content/lenders/rcn-capital.png"
},
{
"name":"Newfi Wholesale",
"short":"NW",
"tier":"Bronze",
"color":"#0b2a5b",
"desc":"Founded by veteran Non-QM professionals, Newfi Wholesale is a leading Non-QM and Jumbo mortgage lender. We have a heart to close loans and see the real people behind each file. We make common sense in-house exceptions on our Non-QM product suite. Committed to making Non-QM easy, we provide industry-leading customer service, competitive pricing, innovative product offerings, intuitive technology, and a simple and efficient loan process for our brokers.",
"body":[
"Founded by veteran Non-QM professionals, Newfi Wholesale is a leading Non-QM and Jumbo mortgage lender. We have a heart to close loans and see the real people behind each file. We make common sense in-house exceptions on our Non-QM product suite. Committed to making Non-QM easy, we provide industry-leading customer service, competitive pricing, innovative product offerings, intuitive technology, and a simple and efficient loan process for our brokers."
],
"tags":[
"DSCR",
"Non-QM",
"Jumbo",
"ITIN",
"Seconds",
"Graduated Payment Mortgage"
],
"featured":true,
"logo":"assets/content/lenders/newfi-wholesale.png"
},
{
"name":"Gold Star Wholesale",
"short":"GSW",
"tier":"Bronze",
"color":"#e0982a",
"desc":"Founded in 2000 by Daniel Milstein and headquartered in Ann Arbor, MI, Gold Star Mortgage Financial Group, Corp , is one of the nation’s premier mortgage companies, originating billions in home loans in branches from coast-to-coast. Despite our consistent growth during the past two decades, we’ve never lost sight of the importance of providing the dream of homeownership – one Borrower at a time.",
"body":[
"Founded in 2000 by Daniel Milstein and headquartered in Ann Arbor, MI, Gold Star Mortgage Financial Group, Corp , is one of the nation’s premier mortgage companies, originating billions in home loans in branches from coast-to-coast. Despite our consistent growth during the past two decades, we’ve never lost sight of the importance of providing the dream of homeownership – one Borrower at a time.",
"Named one of the fastest growing companies by Inc. Magazine , Gold Star is repeatedly honored for industry-leading technology, loan process and workplace culture, with awards including Detroit Free Press Top Workplace (seven years), Ellie Mae Hall of Fame multi-year inductee for both Outstanding Efficiency and ROI, and Ellie Mae’s Inaugural 2018 Innovator of the Year. Gold Star is privileged to provide our unsurpassed technology-driven, five-star rated Borrower experience to our ever-expanding family of customers."
],
"tags":[
"Conventional",
"DPA",
"FHA",
"FloatDown",
"Jumbo",
"TBD",
"USDA",
"VA"
],
"featured":false,
"logo":"assets/content/lenders/gold-star-wholesale.png"
},
{
"name":"PRMG",
"short":"PRMG",
"tier":"Bronze",
"color":"#15467e",
"desc":"Since 2001, Paramount Residential Mortgage Group Inc. (PRMG) continues to be a Top 25 Leading Lender in the mortgage industry. As a privately held mortgage banker and residential home lender, PRMG has successfully helped many borrowers purchase and refinance their homes throughout the United States. Our goal is to provide customers with a 'Path to Pivot' to more consumer facing activities and modern lending technology. This includes innovative products and industry-leading customer service levels.",
"body":[
"Since 2001, Paramount Residential Mortgage Group Inc. (PRMG) continues to be a Top 25 Leading Lender in the mortgage industry. As a privately held mortgage banker and residential home lender, PRMG has successfully helped many borrowers purchase and refinance their homes throughout the United States. Our goal is to provide customers with a 'Path to Pivot' to more consumer facing activities and modern lending technology. This includes innovative products and industry-leading customer service levels."
],
"tags":[
"DSCR",
"Non-QM",
"Jumbo",
"ITIN",
"Seconds",
"Graduated Payment Mortgage"
],
"featured":true,
"logo":"assets/content/lenders/prmg.png"
},
{
"name":"KIND Lending",
"short":"KL",
"tier":"Fuse Flex",
"color":"#1b9d6b",
"desc":"Kind Lending, LLC (NMLS #3925) is a wholesale mortgage lender. Glenn Stearns founded it in 2020, and it has grown into one of the fastest-growing wholesale lenders in the country, with about 470 employees. Kind is built around its \"#kindmovement\" culture and its Kwikie broker portal, which offers 24/7 online locking, forward locks before application, manual downgrades with no price hit, and Fannie and Freddie priced separately.",
"body":[
"Kind Lending, LLC (NMLS #3925) is a wholesale mortgage lender. Glenn Stearns founded it in 2020, and it has grown into one of the fastest-growing wholesale lenders in the country, with about 470 employees. Kind is built around its \"#kindmovement\" culture and its Kwikie broker portal, which offers 24/7 online locking, forward locks before application, manual downgrades with no price hit, and Fannie and Freddie priced separately."
],
"tags":[
"FHA 100% DPA",
"Conventional",
"Jumbo",
"Spark Non-QM",
"Bank Statement",
"DSCR",
"HELOC/DPA",
"USDA",
"VA",
"CalHFA"
],
"featured":false,
"logo":"assets/content/lenders/kind-lending.png"
},
{
"name":"MLB Wholesale",
"short":"MW",
"tier":"Fuse Flex",
"color":"#3a6b35",
"desc":"",
"body":[],
"tags":[
"Conventional",
"FHA",
"Jumbo",
"Non-QM"
],
"featured":false,
"logo":"assets/content/lenders/mlb-wholesale.png"
},
{
"name":"Verus Wholesale",
"short":"VW",
"tier":"Fuse Flex",
"color":"#7a3fb0",
"desc":"Verus Wholesale is the broker channel of Verus Mortgage Capital, one of the largest non-QM investors in the country. Verus is the mortgage arm of Invictus Capital Partners, which was ranked the #1 non-agency MBS issuer in 2023. Verus had bought non-QM and investor loans through its correspondent channel for years, and it launched Verus Wholesale in 2023 to work directly with brokers. Invictus has completed more than 90 securitizations totaling over $45B. In September 2026, New York Life Investment Management agreed to buy a majority stake in Invictus, with the deal expected to close in Q1 2027.",
"body":[
"Verus Wholesale is the broker channel of Verus Mortgage Capital, one of the largest non-QM investors in the country. Verus is the mortgage arm of Invictus Capital Partners, which was ranked the #1 non-agency MBS issuer in 2023. Verus had bought non-QM and investor loans through its correspondent channel for years, and it launched Verus Wholesale in 2023 to work directly with brokers. Invictus has completed more than 90 securitizations totaling over $45B. In September 2026, New York Life Investment Management agreed to buy a majority stake in Invictus, with the deal expected to close in Q1 2027."
],
"tags":[
"Non-QM",
"DSCR",
"Jumbo",
"Foreign National",
"HELOC"
],
"featured":false,
"logo":"assets/content/lenders/verus-wholesale.png"
},
{
"name":"FlipCo",
"short":"FLIP",
"tier":"AIME Capital",
"color":"#86145a",
"desc":"FlipCo Financial is a private balance-sheet lender for real estate investors, founded in 2020 and an AIME Capital Partner. FlipCo sets its own credit rules and underwrites mainly on the property and the rehab plan, not on personal income. It reports more than $500M deployed and over 600 properties funded in the past 12 months.",
"body":[
"FlipCo Financial is a private balance-sheet lender for real estate investors, founded in 2020 and an AIME Capital Partner. FlipCo sets its own credit rules and underwrites mainly on the property and the rehab plan, not on personal income. It reports more than $500M deployed and over 600 properties funded in the past 12 months."
],
"tags":[
"Fix & Flip",
"Short-Term Bridge"
],
"featured":false,
"logo":"assets/content/lenders/flipco.png"
}
],
"vendors":[
{
"name":"Advantage Partners Solutions",
"company":"Advantage Partners Solutions",
"short":"APS",
"cat":"Origination Tools",
"group":"Core Partner",
"g":[
"#1b7a4a",
"#2bb673"
],
"desc":"Advantage Partners Solutions is a national mortgage Consumer Reporting Agency (CRA) built to support lenders at every stage of the loan process. Our services cover tri-merge credit reports, income and employment verification, flood determinations, fraud and identity protection, 4506-C tax transcripts, SSA-89 Social Security verification, and background screening, all delivered through a single relationship.",
"body":[
"Advantage Partners Solutions is a national mortgage Consumer Reporting Agency (CRA) built to support lenders at every stage of the loan process. Our services cover tri-merge credit reports, income and employment verification, flood determinations, fraud and identity protection, 4506-C tax transcripts, SSA-89 Social Security verification, and background screening, all delivered through a single relationship.",
"Our dual-platform model gives clients a genuine choice: access credit reporting through Credit Interlink, our proprietary in-house platform, or through MeridianLink Mortgage Credit Link, depending on which fits your existing workflow. We integrate around your setup so your team keeps moving without retraining or disruption.",
"Independent mortgage brokers work with us because we combine fast, accurate, FCRA-compliant reporting with the kind of responsive service that is hard to find at larger CRAs. When you need someone on the phone, we pick up."
],
"tags":[
"Origination Tools"
],
"offer":"Advantage Partners Solutions is a national mortgage Consumer Reporting Agency (CRA) built to support lenders…",
"benefit":"",
"access":[
"All Members"
],
"connect":true,
"logo":"assets/content/vendors/advantage-partners-solutions.jpg",
"art":true
},
{
"name":"Advantage Partners Solutions Ask Mindy",
"company":"Advantage Partners Solutions",
"short":"APS",
"cat":"Education",
"group":"Core Partner",
"g":[
"#86145a",
"#dd1969"
],
"desc":"AIME VIP and Elite Members have direct access to Mindy Leisure, Advantage Partners Solutions’ in-house Credit Expert, as an exclusive benefit of their membership.",
"body":[
"AIME VIP and Elite Members have direct access to Mindy Leisure, Advantage Partners Solutions’ in-house Credit Expert, as an exclusive benefit of their membership.",
"Mindy fields credit-related questions across the full range of mortgage scenarios: score optimization strategies, dispute navigation, bureau behavior, borrower coaching, and tricky file situations. She brings deep practical knowledge to every question, and her answers are grounded in how credit actually works in a live mortgage pipeline."
],
"tags":[
"Education"
],
"offer":"AIME VIP and Elite Members have direct access to Mindy Leisure, Advantage Partners Solutions’ in-house Credit…",
"benefit":"AIME VIP and Elite Members have direct access to Mindy Leisure, Advantage Partners Solutions’ in-house Credit Expert, as an exclusive benefit of their membership.",
"access":[
"All Members"
],
"connect":true,
"logo":"assets/content/vendors/advantage-partners-solutions-ask-mindy.jpg",
"art":true
},
{
"name":"Advantage Partners Solutions Discounted Credit Reports",
"company":"Advantage Partners Solutions",
"short":"APS",
"cat":"Origination Tools",
"group":"Core Partner",
"g":[
"#0b6b82",
"#20adce"
],
"desc":"AIME VIP and Elite Members receive an exclusive discount on Advantage Partners Solutions credit reports as part of their membership benefits.",
"body":[
"AIME VIP and Elite Members receive an exclusive discount on Advantage Partners Solutions credit reports as part of their membership benefits.",
"Reports are available through both Credit Interlink and MeridianLink Mortgage Credit Link, giving you flexibility in how you order based on your existing setup. Every report is FCRA-compliant, tri-merge, and delivered with the turnaround speed your pipeline requires."
],
"tags":[
"Origination Tools"
],
"offer":"AIME VIP and Elite Members receive an exclusive discount on Advantage Partners Solutions credit reports as…",
"benefit":"AIME VIP and Elite Members receive an exclusive discount on Advantage Partners Solutions credit reports as part of their membership benefits.",
"access":[
"Elite",
"VIP"
],
"connect":true,
"logo":"assets/content/vendors/advantage-partners-solutions-discounted-credit-reports.jpg",
"art":true
},
{
"name":"Advantage Partners Solutions Waived Inspection Fee",
"company":"Advantage Partners Solutions",
"short":"APS",
"cat":"Origination Tools",
"group":"Core Partner",
"g":[
"#0b1f5b",
"#163a85"
],
"desc":"When AIME VIP and Elite Members sign up with Advantage Partners Solutions, the $125 third-party office inspection fee is waived. This fee is charged by an independent inspection company as a required step in the onboarding process with any credit provider, and APS will cover it on your behalf.",
"body":[
"When AIME VIP and Elite Members sign up with Advantage Partners Solutions, the $125 third-party office inspection fee is waived. This fee is charged by an independent inspection company as a required step in the onboarding process with any credit provider, and APS will cover it on your behalf.",
"The offer is available for a limited time for members who sign up within the next six months."
],
"tags":[
"Origination Tools"
],
"offer":"When AIME VIP and Elite Members sign up with Advantage Partners Solutions, the $125 third-party office…",
"benefit":"When AIME VIP and Elite Members sign up with Advantage Partners Solutions, the $125 third-party office inspection fee is waived. This fee is charged by an independent inspection company as a required step in the onboarding process with any credit provider, and APS will cover it on your behalf.",
"access":[
"All Members"
],
"connect":true,
"logo":"assets/content/vendors/advantage-partners-solutions-waived-inspection-fee.jpg",
"art":true
},
{
"name":"ARIVE",
"company":"ARIVE",
"short":"A",
"cat":"Origination Tools",
"group":"Core Partner",
"g":[
"#4a217a",
"#7a3fb0"
],
"desc":"ARIVE is the industry’s first integrated Loan Origination System (LOS), Point of Sale (POS), and Products and Pricing Engine (PPE) with a connected Lender Marketplace, built specifically for independent mortgage Brokers and non-Del correspondents. ARIVE features real-time products & pricing search as well as digital integration capabilities for loan transactions with our integrated Lender partners, and also provides the ability for Brokers to work with any Lender. As a Broker-focused platform with a vibrant community, we listen closely to user feedback and actively work to innovate / add new features to ARIVE on a regular basis.",
"body":[
"ARIVE is the industry’s first integrated Loan Origination System (LOS), Point of Sale (POS), and Products and Pricing Engine (PPE) with a connected Lender Marketplace, built specifically for independent mortgage Brokers and non-Del correspondents. ARIVE features real-time products & pricing search as well as digital integration capabilities for loan transactions with our integrated Lender partners, and also provides the ability for Brokers to work with any Lender. As a Broker-focused platform with a vibrant community, we listen closely to user feedback and actively work to innovate / add new features to ARIVE on a regular basis."
],
"tags":[
"Origination Tools"
],
"offer":"ARIVE is the industry’s first integrated Loan Origination System (LOS), Point of Sale (POS), and Products and…",
"benefit":"",
"access":[
"All Members"
],
"connect":true,
"logo":"assets/content/vendors/arive.jpg",
"art":true
},
{
"name":"Cotality",
"company":"Cotality",
"short":"C",
"cat":"Customer Retention",
"group":"Core Partner",
"g":[
"#0b2a5b",
"#1893b1"
],
"desc":"Big data and analytics are no longer just for big companies. With Cotality’s (formerly CoreLogic) Marketing Solutions for Brokers, you can now supercharge your business with the best source for timely leads and market insights, getting industry-leading data at your fingertips in minutes. Our Marketing Solutions consist of",
"body":[
"Big data and analytics are no longer just for big companies. With Cotality’s (formerly CoreLogic) Marketing Solutions for Brokers, you can now supercharge your business with the best source for timely leads and market insights, getting industry-leading data at your fingertips in minutes. Our Marketing Solutions consist of",
"Precision Marketing leverages real-time geospatial and Cotality’s big data to quickly and accurately identify prospects demonstrating strong purchasing intent. • Be the First to Know Who’s Shopping • Get Smarter Insights to Improve Lead Conversions • Target the Right Customers at the Right Time",
"Market Intelligence harnesses the power of advanced data and analytics to ID profitable market trends, customer preferences, strategic partnerships, and competitive intelligence. • Study Your Competition • Expand Your Market Relationships • Maximize Your Originations",
"Property Intelligence delivers detailed information on 99.99% of the nation’s properties. Access key property information, including current and past owners, transaction history, comparables, legal, tax and zoning details and much more."
],
"tags":[
"Customer Retention"
],
"offer":"Big data and analytics are no longer just for big companies.",
"benefit":"",
"access":[
"All Members"
],
"connect":true,
"logo":"assets/content/vendors/cotality.jpg",
"art":true
},
{
"name":"My Credit Info",
"company":"My Credit Info",
"short":"MCI",
"cat":"Origination Tools",
"group":"Core Partner",
"g":[
"#7a1f1a",
"#e0463c"
],
"desc":"My Credit Info provides nationwide mortgage credit solutions, including soft-pull, hybrid and hard-pull tri-merge reports; FICO and VantageScore options; SmartSelect credit waterfalls; supplements and rapid rescoring; LQI reports; manual VOE/VOA services; borrower-paid SmartPay links; and personalized credit consulting and concierge support.",
"body":[
"My Credit Info provides nationwide mortgage credit solutions, including soft-pull, hybrid and hard-pull tri-merge reports; FICO and VantageScore options; SmartSelect credit waterfalls; supplements and rapid rescoring; LQI reports; manual VOE/VOA services; borrower-paid SmartPay links; and personalized credit consulting and concierge support."
],
"tags":[
"Origination Tools"
],
"offer":"My Credit Info provides nationwide mortgage credit solutions, including soft-pull, hybrid and hard-pull…",
"benefit":"",
"access":[
"All Members"
],
"connect":true,
"logo":"assets/content/vendors/my-credit-info.png"
},
{
"name":"Pre-Fi",
"company":"Pre-Fi",
"short":"PF",
"cat":"Origination Tools",
"group":"Core Partner",
"g":[
"#0f5e3f",
"#1b9d6b"
],
"desc":"Pre-Fi is the most affordable way for independent mortgage brokers to pull credit, dramatically cheaper than anything else in the industry. With just a name, phone, and email, you get a full soft-pull credit report and automated findings on every lead, without burning your budget.",
"body":[
"Pre-Fi is the most affordable way for independent mortgage brokers to pull credit, dramatically cheaper than anything else in the industry. With just a name, phone, and email, you get a full soft-pull credit report and automated findings on every lead, without burning your budget.",
"That changes how you work your pipeline. Instead of chasing everyone, you instantly see who actually qualifies, so you lose less time on dead-end conversations and convert stronger on the leads you do work. And because it all happens from the very first touch, the borrower gets a frictionless experience before you've spent a dime on a hard pull.",
"There's an edge for your marketing, too. If you're running ads, the data Pre-Fi surfaces can train your pixel to bring you better leads over time, so every dollar you spend on acquisition works harder.",
"Pull credit, save a fortune, and qualify every lead. All for less than anyone else in the industry.",
"Some key features include",
"No SSN required: All we need is a name, a phone number, and an email address. No Social, no date of birth, no application. You can assess online leads immediately, establish DTI’s, and prequalify borrowers before wasting your valuable time.",
"Income Verification: WorkNumber co-developed a 2 year average income add-on for only $3.",
"Refi Offers: Custom built Refinance Offer Letters based on customer REO and Title Data so you have everything you need to quote a refi in 4.7 seconds."
],
"tags":[
"Origination Tools"
],
"offer":"Pre-Fi is the most affordable way for independent mortgage brokers to pull credit, dramatically cheaper than…",
"benefit":"",
"access":[
"All Members"
],
"connect":true,
"logo":"assets/content/vendors/pre-fi.png"
},
{
"name":"1Password",
"company":"1Password",
"short":"1",
"cat":"Cyber Security",
"group":"Affiliate",
"g":[
"#5b2a86",
"#a23fb0"
],
"desc":"1Password makes it simple to create and share unique, strong passwords. More than 70,000 companies, including 25 percent of Fortune 100 companies such as IBM, as well as technology leaders like Slack and Dropbox, trust 1Password to secure their business. With 1Password, you can securely share everything you need to work together, and give employees access to logins, documents, credit cards, and more, on all their devices. 1Password is the world’s most-loved password manager, with top ratings from G2Crowd and Trustpilot, and has been named top password manager by leading media outlets including Wired, The New York Times, and CNET.",
"body":[
"1Password makes it simple to create and share unique, strong passwords. More than 70,000 companies, including 25 percent of Fortune 100 companies such as IBM, as well as technology leaders like Slack and Dropbox, trust 1Password to secure their business. With 1Password, you can securely share everything you need to work together, and give employees access to logins, documents, credit cards, and more, on all their devices. 1Password is the world’s most-loved password manager, with top ratings from G2Crowd and Trustpilot, and has been named top password manager by leading media outlets including Wired, The New York Times, and CNET.",
"The secure enterprise password manager",
"1Password is secure by design. The information you store in 1Password is end-to-end encrypted using 256-bit AES encryption. Only you can decrypt your data.Rather than relying on a single point of failure, 1Password is the only password manager to combine a Master Password with a unique, locally generated, 128-bit Secret Key to authenticate.Tamper-proof, end-to-end encryption protects your data at rest and in transit.1Password protects against brute-force attacks by using PBKDF2 for key derivation, making it harder for someone to repeatedly guess your Master Password.Secure Remote Password (SRP) authenticates your credentials without sending them over the Internet.1Password is designed with privacy at its core. Its zero-knowledge architecture means the data you save in 1Password can’t be accessed by anyone else, including us."
],
"tags":[
"Cyber Security"
],
"offer":"1Password makes it simple to create and share unique, strong passwords.",
"benefit":"",
"access":[
"All Members"
],
"connect":false,
"logo":"assets/content/vendors/1password.jpg",
"art":true
},
{
"name":"20/20 Vision for Success",
"company":"20/20 Vision for Success",
"short":"22V",
"cat":"Coaching + Training",
"group":"Vendor Partner",
"g":[
"#7a1f55",
"#dd1969"
],
"desc":"Choose to coach with any of the 20+ professional coaches representing a diversity in expertise unheralded in the industry. Live one-on-one and group coaching. Every coaching client is enrolled in our exclusive virtual training program. Experience the power of industry knowledge, innovation, and proven technique with all-original curriculum created and curated by Master Coach, Christine Beckwith and her team of professional coaches.",
"body":[
"Choose to coach with any of the 20+ professional coaches representing a diversity in expertise unheralded in the industry. Live one-on-one and group coaching. Every coaching client is enrolled in our exclusive virtual training program. Experience the power of industry knowledge, innovation, and proven technique with all-original curriculum created and curated by Master Coach, Christine Beckwith and her team of professional coaches."
],
"tags":[
"Coaching + Training"
],
"offer":"Choose to coach with any of the 20+ professional coaches representing a diversity in expertise unheralded in…",
"benefit":"",
"access":[
"All Members"
],
"connect":true,
"logo":"assets/content/vendors/20-20-vision-for-success.jpg",
"art":true
},
{
"name":"Aila",
"company":"Aila",
"short":"A",
"cat":"Artificial Intelligence",
"group":"Vendor Partner",
"g":[
"#1b7a4a",
"#2bb673"
],
"desc":"Aila is the agentic loan officer assistant built for independent mortgage professionals. Already trusted by 100+ mortgage companies, Aila connects your phone, email, CRM, LOS, and GPT with 20+ platform integrations, and starts at just $50/month with unlimited use.",
"body":[
"Aila is the agentic loan officer assistant built for independent mortgage professionals. Already trusted by 100+ mortgage companies, Aila connects your phone, email, CRM, LOS, and GPT with 20+ platform integrations, and starts at just $50/month with unlimited use.",
"Automatic 1003 Files: Turn borrower calls into MISMO 3.4 files the moment you hang up. Aila listens in the background and builds the complete 1003, ready for one-click export to any LOS.",
"Organize Borrower Interactions: Aila connects your phone, email, CRM, LOS, and GPT into a single living loan record. Every call, email, and document in one place, with borrower data synced to your CRM automatically.",
"Document Collection (coming Q4 2026): Aila builds an adaptive checklist, drafts borrower follow-up in your voice, and chases borrowers until the file is complete.",
"Document Extraction (coming Q4 2026): Every inbound doc is verified instantly. Aila calculates income and drafts messages to the borrower if anything is missing, incomplete, or incorrect.",
"Exclusive for AIME members: get 1 month free on monthly plans, or 4 months free your first year with annual.",
"Meet the founders at FUSE 2026 in Austin: find us at Booth 307 in the Exhibit Hall."
],
"tags":[
"Artificial Intelligence"
],
"offer":"Exclusive for AIME members: get 1 month free on monthly plans, or 4 months free your first year with annual.",
"benefit":"Exclusive for AIME members: get 1 month free on monthly plans, or 4 months free your first year with annual.",
"access":[
"All Members"
],
"connect":true,
"logo":"assets/content/vendors/aila.png"
},
{
"name":"AIME Academy",
"company":"AIME Academy",
"short":"AA",
"cat":"Coaching + Training",
"group":"Vendor Partner",
"g":[
"#86145a",
"#dd1969"
],
"desc":"What is the AIME Academy?",
"body":[
"What is the AIME Academy?",
"Learn at your own pace, with guided assignments from the Academy’s expert instructors. All you need is a computer with an internet connection – we provide the rest. Learners will have access to a dedicated learning facilitator who will oversee their instruction, as well as live instruction, take-home assignments, and video instruction.",
"What courses we currently offer",
"Investor Financing with RCN Capital - Free",
"The Million Dollar Minute Featuring Dale Vermillion - $599",
"VA Basic Movements - $349",
"FHA Certification - $349",
"Self-Employed Income - $349"
],
"tags":[
"Coaching + Training"
],
"offer":"What is the AIME Academy?",
"benefit":"",
"access":[
"All Members"
],
"connect":false,
"logo":"assets/content/vendors/aime-academy.jpg",
"art":true
},
{
"name":"Amarlo",
"company":"Amarlo",
"short":"A",
"cat":"Banking",
"group":"Vendor Partner",
"g":[
"#0b6b82",
"#20adce"
],
"desc":"Amarlo is a modern accounting firm dedicated to empowering mortgage professionals with financial clarity. Our comprehensive services include monthly bookkeeping and fractional CFO services designed specifically for brokers and independent loan officers. By combining industry expertise with advanced data-driven insights, we help our clients make informed decisions and achieve their business goals. Our approach involves a three-step process: reconstructing your financial foundation, predicting future goals, and tracking progress.",
"body":[
"Amarlo is a modern accounting firm dedicated to empowering mortgage professionals with financial clarity. Our comprehensive services include monthly bookkeeping and fractional CFO services designed specifically for brokers and independent loan officers. By combining industry expertise with advanced data-driven insights, we help our clients make informed decisions and achieve their business goals. Our approach involves a three-step process: reconstructing your financial foundation, predicting future goals, and tracking progress.",
"With Amarlo, mortgage professionals can build a robust financial framework that supports long-term success."
],
"tags":[
"Banking"
],
"offer":"Amarlo is a modern accounting firm dedicated to empowering mortgage professionals with financial clarity.",
"benefit":"",
"access":[
"VIP"
],
"connect":true,
"logo":"assets/content/vendors/amarlo.jpg",
"art":true,
"variant":[
"VIP"
]
},
{
"name":"Amarlo",
"company":"Amarlo",
"short":"A",
"cat":"Banking",
"group":"Vendor Partner",
"g":[
"#0b6b82",
"#20adce"
],
"desc":"Amarlo is a modern accounting firm dedicated to empowering mortgage professionals with financial clarity. Our comprehensive services include monthly bookkeeping and fractional CFO services designed specifically for brokers and independent loan officers. By combining industry expertise with advanced data-driven insights, we help our clients make informed decisions and achieve their business goals. Our approach involves a three-step process: reconstructing your financial foundation, predicting future goals, and tracking progress.",
"body":[
"Amarlo is a modern accounting firm dedicated to empowering mortgage professionals with financial clarity. Our comprehensive services include monthly bookkeeping and fractional CFO services designed specifically for brokers and independent loan officers. By combining industry expertise with advanced data-driven insights, we help our clients make informed decisions and achieve their business goals. Our approach involves a three-step process: reconstructing your financial foundation, predicting future goals, and tracking progress.",
"With Amarlo, mortgage professionals can build a robust financial framework that supports long-term success."
],
"tags":[
"Banking"
],
"offer":"Amarlo is a modern accounting firm dedicated to empowering mortgage professionals with financial clarity.",
"benefit":"",
"access":[
"Elite"
],
"connect":true,
"logo":"assets/content/vendors/amarlo.jpg",
"art":true,
"variant":[
"Elite"
]
},
{
"name":"Amarlo",
"company":"Amarlo",
"short":"A",
"cat":"Banking",
"group":"Vendor Partner",
"g":[
"#0b6b82",
"#20adce"
],
"desc":"Amarlo is a modern accounting firm dedicated to empowering mortgage professionals with financial clarity. Our comprehensive services include monthly bookkeeping and fractional CFO services designed specifically for brokers and independent loan officers. By combining industry expertise with advanced data-driven insights, we help our clients make informed decisions and achieve their business goals. Our approach involves a three-step process: reconstructing your financial foundation, predicting future goals, and tracking progress.",
"body":[
"Amarlo is a modern accounting firm dedicated to empowering mortgage professionals with financial clarity. Our comprehensive services include monthly bookkeeping and fractional CFO services designed specifically for brokers and independent loan officers. By combining industry expertise with advanced data-driven insights, we help our clients make informed decisions and achieve their business goals. Our approach involves a three-step process: reconstructing your financial foundation, predicting future goals, and tracking progress.",
"With Amarlo, mortgage professionals can build a robust financial framework that supports long-term success."
],
"tags":[
"Banking"
],
"offer":"Amarlo is a modern accounting firm dedicated to empowering mortgage professionals with financial clarity.",
"benefit":"",
"access":[
"Premium"
],
"connect":true,
"logo":"assets/content/vendors/amarlo.jpg",
"art":true,
"variant":[
"Premium"
]
},
{
"name":"AutoPayPlus",
"company":"AutoPayPlus",
"short":"A",
"cat":"Customer Retention",
"group":"Vendor Partner",
"g":[
"#0b1f5b",
"#163a85"
],
"desc":"AutoPayPlus helps mortgage professionals like you maintain clients and build predictable recurring revenue without refinances or stressful lead chasing. By automating biweekly payments matched to borrowers’ paychecks, you can potentially deepen trust, dramatically boost retention, and build relationships that grow your business each and every year.",
"body":[
"AutoPayPlus helps mortgage professionals like you maintain clients and build predictable recurring revenue without refinances or stressful lead chasing. By automating biweekly payments matched to borrowers’ paychecks, you can potentially deepen trust, dramatically boost retention, and build relationships that grow your business each and every year."
],
"tags":[
"Customer Retention"
],
"offer":"AutoPayPlus helps mortgage professionals like you maintain clients and build predictable recurring revenue…",
"benefit":"",
"access":[
"All Members"
],
"connect":true,
"logo":"assets/content/vendors/autopayplus.png"
},
{
"name":"Berman Media PD (Elite & VIP)",
"company":"Berman Media",
"short":"BMP",
"cat":"Coaching + Training",
"group":"Vendor Partner",
"g":[
"#4a217a",
"#7a3fb0"
],
"desc":"AIME ELITE AND VIP MEMBERS RECEIVE 10% OFF",
"body":[
"AIME ELITE AND VIP MEMBERS RECEIVE 10% OFF",
"The Beyond The Method (TM) course is a 100 video and 27 homework assignment program that compirses of three phases. Phase 1 being your content, Phase 2 being prospecting, and Phase 3 being the Instagram Flywheel. Below is a description of each of the parts related to each phase.",
"Phase 1: Content",
"What to post (discuss pillars & execution)",
"What to say (discuss scripting and copywriting so you sound good on video and write well for the Instagram platform)",
"What it should look like (branding)- as a private coaching client, my team will do this all FOR you so you will have an entire Instagram/social template deck created from scratch to match your personality, vibe etc.",
"Phase 2: Prospecting",
"Who to be talking to"
],
"tags":[
"Coaching + Training"
],
"offer":"AIME ELITE AND VIP MEMBERS RECEIVE 10% OFF",
"benefit":"AIME ELITE AND VIP MEMBERS RECEIVE 10% OFF",
"access":[
"Elite",
"VIP"
],
"connect":true,
"logo":"assets/content/vendors/berman-media-pd-elite-vip.jpg",
"art":true
},
{
"name":"Berman Media PD (for Premium)",
"company":"Berman Media",
"short":"BMP",
"cat":"Coaching + Training",
"group":"Vendor Partner",
"g":[
"#0b2a5b",
"#1893b1"
],
"desc":"AIME PREMIUM MEMBERS RECEIVE 5% OFF",
"body":[
"AIME PREMIUM MEMBERS RECEIVE 5% OFF",
"The Beyond The Method (TM) course is a 100 video and 27 homework assignment program that compirses of three phases. Phase 1 being your content, Phase 2 being prospecting, and Phase 3 being the Instagram Flywheel. Below is a description of each of the parts related to each phase.",
"Phase 1: Content",
"What to post (discuss pillars & execution)",
"What to say (discuss scripting and copywriting so you sound good on video and write well for the Instagram platform)",
"What it should look like (branding)- as a private coaching client, my team will do this all FOR you so you will have an entire Instagram/social template deck created from scratch to match your personality, vibe etc.",
"Phase 2: Prospecting",
"Who to be talking to"
],
"tags":[
"Coaching + Training"
],
"offer":"AIME PREMIUM MEMBERS RECEIVE 5% OFF",
"benefit":"AIME PREMIUM MEMBERS RECEIVE 5% OFF",
"access":[
"Premium"
],
"connect":true,
"logo":"assets/content/vendors/berman-media-pd-for-premium.jpg",
"art":true
},
{
"name":"BrokerVA",
"company":"BrokerVA",
"short":"B",
"cat":"Business Ops",
"group":"Vendor Partner",
"g":[
"#7a1f1a",
"#e0463c"
],
"desc":"At BrokerVA, we help mortgage brokers, correspondent lenders, and wholesale lenders strengthen and scale their backend operations with experienced mortgage support professionals. Our specialists support non-consumer-facing responsibilities across the loan lifecycle, including Setup, Disclosures, Closing, Funding, and Post-Closing, and are backed by experienced HeadVAs who help ensure a smooth implementation and continued success.",
"body":[
"At BrokerVA, we help mortgage brokers, correspondent lenders, and wholesale lenders strengthen and scale their backend operations with experienced mortgage support professionals. Our specialists support non-consumer-facing responsibilities across the loan lifecycle, including Setup, Disclosures, Closing, Funding, and Post-Closing, and are backed by experienced HeadVAs who help ensure a smooth implementation and continued success.",
"Our approach is rooted in bayanihan , the Filipino tradition of working together toward a shared goal. It shapes how we recruit, support, and develop our teams, allowing our professionals to integrate seamlessly into our clients' operations as dedicated extensions of their team.",
"BrokerVA maintains an NMLS-licensed mortgage branch in the Philippines (NMLS #1977844) and directly employs more than 150 mortgage professionals supporting clients across the United States. Our model is built around security, clearly defined roles, and structured oversight to support our clients' compliance and information security programs.",
"The result is a trusted operational partnership that helps mortgage companies increase capacity, improve consistency, and scale with confidence!"
],
"tags":[
"Business Ops"
],
"offer":"At BrokerVA, we help mortgage brokers, correspondent lenders, and wholesale lenders strengthen and scale…",
"benefit":"",
"access":[
"All Members"
],
"connect":true,
"logo":"assets/content/vendors/brokerva.jpg",
"art":true
},
{
"name":"Co/LAB",
"company":"CoLAB",
"short":"CL",
"cat":"Coaching + Training",
"group":"Vendor Partner",
"g":[
"#0f5e3f",
"#1b9d6b"
],
"desc":"Co/LAB — You Own It. We Support It.",
"body":[
"Co/LAB — You Own It. We Support It.",
"Running a brokerage is a big job. We make it manageable.",
"You started your brokerage to build something — not to spend your days buried in compliance filings, license renewals, and the endless operational details that come with running a team. At Co/LAB, we work with broker owners who are serious about growth and serious about getting the right support to make it happen.",
"We offer two core solutions built specifically for the way brokerages operate today.",
"Concierge Services — Your Compliance & Licensing, Handled.",
"Think of us as a dedicated extension of your team. Our Concierge services take the regulatory and operational weight off your plate so you can stay focused on originating and growing your business.",
"We offer Four service tiers depending on where your brokerage is right now",
"✅ Core Broker Lite — MCR reporting, NMLS monitoring, Secretary of State oversight, company & branch license management, dedicated account executive, and quarterly compliance meetings."
],
"tags":[
"Coaching + Training"
],
"offer":"Co/LAB — You Own It.",
"benefit":"",
"access":[
"All Members"
],
"connect":true,
"logo":"assets/content/vendors/co-lab.jpg",
"art":true
},
{
"name":"Corporate Shopping",
"company":"Corporate Shopping",
"short":"CS",
"cat":"Customer Retention",
"group":"Affiliate",
"g":[
"#5b2a86",
"#a23fb0"
],
"desc":"CORPORATE SHOPPING MEMBER DISCOUNTS",
"body":[
"CORPORATE SHOPPING MEMBER DISCOUNTS",
"Corporate Shopping connects AIME members to over 250 top national retailers offering incredible employee discounts and private offers.",
"A few popular retailers include: Costco, Sam’s Club, Avis, Hertz, Budget, Expedia.com, Booking.com, 1800Flowers, TrueCar Employee Auto Purchasing, Walt Disney World, GE Appliances Store, HP Employee Purchase Program, Lenovo, Dell Member Purchase Program & Many More!"
],
"tags":[
"Customer Retention"
],
"offer":"Corporate Shopping connects AIME members to over 250 top national retailers offering incredible employee…",
"benefit":"Corporate Shopping connects AIME members to over 250 top national retailers offering incredible employee discounts and private offers.",
"access":[
"All Members"
],
"connect":false,
"logo":"assets/content/vendors/corporate-shopping.jpg",
"art":true
},
{
"name":"Direct Authority AI",
"company":"Loans On Demand",
"short":"DAA",
"cat":"Artificial Intelligence",
"group":"Vendor Partner",
"g":[
"#7a1f55",
"#dd1969"
],
"desc":"Top loan officers have discovered a secret weapon: AI.",
"body":[
"Top loan officers have discovered a secret weapon: AI.",
"Not just for fancy marketing, but to transform their entire business. They're closing more loans with less effort while everyone else struggles to keep up.",
"We built Direct Authority AI after seeing what actually works in today's mortgage market.",
"What's actually inside:Loan-generating AI prompt templates",
"Custom-designed prompts that create YouTube scripts in your authentic voice (in minutes, not days)",
"Social media frameworks that sound exactly like you wrote them (but better and faster)",
"Email sequences that feel personal but take seconds to create",
"Marketing prompts that make your content stand out without sounding \"AI-generated\""
],
"tags":[
"Artificial Intelligence"
],
"offer":"Top loan officers have discovered a secret weapon: AI.",
"benefit":"",
"access":[
"All Members"
],
"connect":true,
"logo":"assets/content/vendors/direct-authority-ai.png"
},
{
"name":"Empower LO",
"company":"Empower LO",
"short":"EL",
"cat":"Business Ops",
"group":"Vendor Partner",
"g":[
"#1b7a4a",
"#2bb673"
],
"desc":"Empower LO is a mortgage growth system designed specifically for independent mortgage professionals and broker teams. Unlike a blank CRM that leaves you to build everything yourself, Empower LO arrives configured with mortgage-ready pipelines, campaigns, workflows, templates, automations, and guided onboarding.",
"body":[
"Empower LO is a mortgage growth system designed specifically for independent mortgage professionals and broker teams. Unlike a blank CRM that leaves you to build everything yourself, Empower LO arrives configured with mortgage-ready pipelines, campaigns, workflows, templates, automations, and guided onboarding.",
"The platform brings your contacts, conversations, tasks, appointments, campaigns, and pipeline into one place. It helps you respond to new opportunities faster, nurture borrowers who are not ready today, maintain relationships with past clients and referral partners, and create more consistent follow-up throughout your business. Customers also receive hands-on support from a team that understands mortgage, including live Open Office Hours on eligible plans.",
"Empower LO offers Launch and Scale plans for individual originators, Teams for brokerages that need shared standards, lead routing, visibility, and rollout support, and Custom Builds for more complex operations. Eligible Scale and Teams customers can also add LeadEngine, an optional managed service combining Google Ads, mortgage landing pages, CRM delivery, and follow-up strategy.",
"As an exclusive member benefit, AIME members receive 50% off the applicable one-time setup fee across all Empower LO services."
],
"tags":[],
"offer":"As an exclusive member benefit, AIME members receive 50% off the applicable one-time setup fee across all…",
"benefit":"As an exclusive member benefit, AIME members receive 50% off the applicable one-time setup fee across all Empower LO services.",
"access":[
"All Members"
],
"connect":true,
"logo":"assets/content/vendors/empower-lo.png"
},
{
"name":"Everee",
"company":"Everee",
"short":"E",
"cat":"Business Ops",
"group":"Vendor Partner",
"g":[
"#86145a",
"#dd1969"
],
"desc":"Payroll built for how mortgage brokerages actually pay people.",
"body":[
"Payroll built for how mortgage brokerages actually pay people.",
"Everee is modern payroll and same-day pay designed for how independent mortgage brokerages run. Instead of making your loan officers wait for the next comp cycle, you can pay their commission the day a loan funds. Run payroll as often as you want at no extra cost, and let Everee handle every federal, state, and local tax filing so you can operate in more states without adding overhead.",
"What makes Everee different",
"You only pay for people who actually get paid —no minimums, no base fees, no per-run charges",
"Unlimited payroll runs, always included — pay on any schedule, including off-cycle commission runs.",
"Same-day pay — get commissions to your LOs fast, a real recruiting and retention edge.",
"Withholding built for commission checks — Everee's Optimized method avoids the over-withholding that standard payroll hits irregular commission income with, so your LOs keep more of each check now.",
"Every state, handled — all federal, state, and local filings included, so multi-state growth doesn't mean more admin."
],
"tags":[
"Business Ops"
],
"offer":"Payroll built for how mortgage brokerages actually pay people.",
"benefit":"",
"access":[
"All Members"
],
"connect":true,
"logo":"assets/content/vendors/everee.png"
},
{
"name":"Gusto",
"company":"Gusto",
"short":"G",
"cat":"Banking",
"group":"Affiliate",
"g":[
"#0b6b82",
"#20adce"
],
"desc":"Pay your employees and contractors with smart technology.",
"body":[
"Pay your employees and contractors with smart technology.",
"With Gusto, payroll takes just a few clicks. Plus, we automatically file your taxes, help with compliance, and identify tax credits to help save you money you may never have known you qualified for.",
"Unlimited payroll runs for no extra chargeState tax registration in all 50 statesLocal, state, and federal payroll tax filingInternational contractor payments in over 80 countriesAutomatic tax calculationsTime tracking synced with payrollDirect deposits"
],
"tags":[
"Banking"
],
"offer":"Pay your employees and contractors with smart technology.",
"benefit":"",
"access":[
"All Members"
],
"connect":false,
"logo":"assets/content/vendors/gusto.jpg",
"art":true
},
{
"name":"KeySteps, Powered by FinLocker",
"company":"FinLocker",
"short":"KPB",
"cat":"Customer Retention",
"group":"Vendor Partner",
"g":[
"#0b1f5b",
"#163a85"
],
"desc":"Modern Tools for Modern Buyers and Brokers!",
"body":[
"Modern Tools for Modern Buyers and Brokers!",
"KeySteps, powered by FinLocker, is a financial fitness and homeownership readiness platform built specifically for mortgage brokers who serve their communities, not just their pipelines. It’s not a CRM. It’s not just a credit simulator. It’s a full suite of personal finance tools, including budgeting, credit tracking, savings goals, property search, and readiness education, personalized to you and designed to keep you connected to buyers well before they’re ready to apply.",
"Why does this matter?",
"Because 70% of today’s homebuyers are Gen Y and Gen Z, and nearly half are starting their homeownership journey with a lender before they start shopping for homes, according to the latest data from the J.D. Power 2025 Mortgage Origination Satisfaction Study. If you’re not showing up early, you’re probably not showing up at all.KeySteps empowers brokers to:→ Build trust at the point of thought, not just the point of sale→ Stay top-of-mind over long buying cycles—6, 12, even 36 months→ Reduce cost and risk of credit pulls through real-time BuyerVision reports→ Help consumers improve credit, reduce debt, and achieve mortgage readiness→ Deliver mortgage-ready buyers to referral partners instead of cold leads",
"Consumer Benefits Include:﻿",
"Personalized budgeting and savings plans",
"Credit monitoring with actionable alerts and simulators ▪ Readiness journeys built around their goals and timeline",
"A clear, empowering roadmap to homeownership"
],
"tags":[
"Customer Retention"
],
"offer":"Modern Tools for Modern Buyers and Brokers!",
"benefit":"",
"access":[
"All Members"
],
"connect":true,
"logo":"assets/content/vendors/keysteps-powered-by-finlocker.jpg",
"art":true
},
{
"name":"Lead Hackers",
"company":"Lead Hackers",
"short":"LH",
"cat":"Lead Generation",
"group":"Vendor Partner",
"g":[
"#4a217a",
"#7a3fb0"
],
"desc":"Built for Mortgage Brokers. Powered by Results.",
"body":[
"Built for Mortgage Brokers. Powered by Results.",
"Most mortgage brokers are stuck. Stuck buying overpriced leads. Stuck relying on agencies that overpromise and underdeliver. Stuck with cold leads that never pick up the phone.",
"Lead Hackers changes that.",
"We give mortgage professionals the one thing they’ve been missing: control .",
"With Lead Hackers, you get the most affordable, scalable, and broker-friendly lead generation system on the market. Period. Built on 7+ years of battle-tested experience and powered by GoHighLevel, our white-label platform lets you launch ads on Facebook, Instagram, and Google in just 3 clicks—without a marketing degree or $5K/month retainer.",
"What Makes Lead Hackers Different?",
"✅ The Fastest Ad Launch System in the Industry",
"Go from setup to live ads in less than 10 minutes . We’ve eliminated the learning curve so you can stop waiting and start closing."
],
"tags":[
"Lead Generation"
],
"offer":"Built for Mortgage Brokers.",
"benefit":"",
"access":[
"All Members"
],
"connect":true,
"logo":"assets/content/vendors/lead-hackers.jpg",
"art":true
},
{
"name":"Leaf360",
"company":"Leaf360",
"short":"L",
"cat":"CRM",
"group":"Vendor Partner",
"g":[
"#0b2a5b",
"#1893b1"
],
"desc":"Leaf360 is the operating system for independent mortgage brokers. Three connected workspaces, with Lia running across all of them.",
"body":[
"Leaf360 is the operating system for independent mortgage brokers. Three connected workspaces, with Lia running across all of them.",
"Lia",
"Lia is the loan intelligence assistant at the center of Leaf360. Ask Lia anything in the system: a borrower's income docs, an appraisal you need reviewed, a lender's guidelines on a tricky scenario, a campaign you want to run, a pipeline question you need answered now.",
"Lia runs comp analysis on appraisals, flags red flags, reconciles value, and reviews the 1004 form. She analyzes income docs at the file level. She checks scenarios against the guidelines for the lenders in your marketplace. She handles pipeline, follow-up, and campaigns. \"Build a nurture campaign for my past clients.\" \"Show me the borrowers I should call today.\" \"Summarize my last week of emails.\" Lia does it.",
"What you put into Leaf360 stays in Leaf360. Lia is private and compliant by design.",
"Each of the capabilities Lia handles is sold elsewhere as a standalone product. Lia replaces the stack.",
"Three workspaces, one platform",
"Leaf360 CRM handles the day-to-day relationships. Pipeline, contacts, agentic campaigns, realtor landing pages and websites. Built for the loan officers and producing teams who run on referrals. Leaf360 TPO lives inside it: a marketplace of wholesale lenders that brokers and their AEs can query in plain language for guidelines, SOPs, and submission requirements."
],
"tags":[
"CRM"
],
"offer":"Leaf360 is the operating system for independent mortgage brokers.",
"benefit":"",
"access":[
"All Members"
],
"connect":true,
"logo":"assets/content/vendors/leaf360.png"
},
{
"name":"Loan Team Training",
"company":"Loan Team Training",
"short":"LTT",
"cat":"Coaching + Training",
"group":"Vendor Partner",
"g":[
"#7a1f1a",
"#e0463c"
],
"desc":"Loan Team Training helps Loan Officers build high-performing, well-trained teams so they can grow their business without the overwhelm. Led by Irene Duford and her experienced team, their programs are designed to create clarity, consistency, and a client experience that wows. Their offerings include",
"body":[
"Loan Team Training helps Loan Officers build high-performing, well-trained teams so they can grow their business without the overwhelm. Led by Irene Duford and her experienced team, their programs are designed to create clarity, consistency, and a client experience that wows. Their offerings include",
"✔️ WOW Training : A step-by-step blueprint to deliver a 5-star client experience, improve team efficiency, and build loyal referral relationships.",
"✔️ Client Conversion Training : Proven strategies to help Loan Officers and their teams confidently convert leads before, during, and after the loan consultation.",
"✔️ Loan Assistant Mortgage Training Bootcamp : A comprehensive mortgage training course for newer Loan Assistants and MLOs in the daily workflow of a successful mortgage. ﻿ Whether you need help making sure you have the right Loan Partner, equipping your team to perform at a high level, or creating more time and peace in your business, Loan Team Training delivers real-world tools that work!"
],
"tags":[
"Coaching + Training"
],
"offer":"Loan Team Training helps Loan Officers build high-performing, well-trained teams so they can grow their…",
"benefit":"",
"access":[
"All Members"
],
"connect":true,
"logo":"assets/content/vendors/loan-team-training.jpg",
"art":true
},
{
"name":"LoanSites",
"company":"LoanSites",
"short":"L",
"cat":"Websites",
"group":"Vendor Partner",
"g":[
"#0f5e3f",
"#1b9d6b"
],
"desc":"Ready for a website that you're proud of? LoanSites specializes in building custom, high-converting, SEO-optimized mortgage websites that help loan officers grow their online presence and generate real, qualified leads. When you sign up, we build your website on a development link within 10 business days of receiving your info. We then collaborate with you to refine the site until it's exactly what you want - and once approved, we take it live on your domain.",
"body":[
"Ready for a website that you're proud of? LoanSites specializes in building custom, high-converting, SEO-optimized mortgage websites that help loan officers grow their online presence and generate real, qualified leads. When you sign up, we build your website on a development link within 10 business days of receiving your info. We then collaborate with you to refine the site until it's exactly what you want - and once approved, we take it live on your domain.",
"Every site includes unlimited ongoing support , so you're never stuck waiting or paying extra for updates. But a great website isn’t enough if no one sees it. That’s why we offer an Advanced SEO package designed to drive targeted traffic straight to your site. Our approach includes tailored keyword strategies, regular content creation, Google Business Profile optimization, press releases, and essential backlinking techniques that help you rank prominently on Google. To turn your traffic into leads, we build each website with proven lead generation techniques, strategically designed calls-to-action, propriatary calculators, and conversion-focused layouts.",
"﻿Need help beyond your website? Our Unlimited Graphic Design package gives you access to custom branding, email signatures, flyers, social media posts, and more - all at a flat monthly rate. LoanSites was built to be a no-brainer solution for mortgage professionals who want results. No long-term contracts. No limits on support. Just fast customer service with a passion to help you grow."
],
"tags":[
"Websites"
],
"offer":"Ready for a website that you're proud of?",
"benefit":"",
"access":[
"All Members"
],
"connect":true,
"logo":"assets/content/vendors/loansites.jpg",
"art":true
},
{
"name":"Madison Chase Academy",
"company":"Madison Chase Academy",
"short":"MCA",
"cat":"Coaching + Training",
"group":"Vendor Partner",
"g":[
"#5b2a86",
"#a23fb0"
],
"desc":"Madison Chase Academy is a premier training platform created to help mortgage loan officers build profitable, sustainable businesses. Founded by award-winning mortgage professional Tanya Blanchard — the preferred lender for HGTV’s Married to Real Estate star Egypt Sherrod’s estate firm, Indigo Road Realty — the Academy provides real-world education, tools, and mentorship designed to elevate both new and experienced loan officers.",
"body":[
"Madison Chase Academy is a premier training platform created to help mortgage loan officers build profitable, sustainable businesses. Founded by award-winning mortgage professional Tanya Blanchard — the preferred lender for HGTV’s Married to Real Estate star Egypt Sherrod’s estate firm, Indigo Road Realty — the Academy provides real-world education, tools, and mentorship designed to elevate both new and experienced loan officers.",
"Our flagship program, 6 Months to 6 Figures , is a step-by-step course that teaches the fundamentals of loan origination, client communication, mortgage guidelines, fee sheets, disclosures, and compliance. The course includes 7 instructional modules, a comprehensive workbook, monthly group coaching calls, and a private support community. We also teach you how to go out and get business with our proven 30 Day Jump Start — a tactical plan designed to build momentum, boost confidence, and generate real leads in your first month.",
"6 Months to 6 Figures is proud to be an approved course with Ameritrain Mortgage Institute, a leading education provider in the mortgage industry. And we stand by our results: We offer a Money-Back Guarantee. If you complete the course and follow the path we lay out — you will earn six figures in six months. That’s our commitment to your success.",
"At Madison Chase Academy , we don’t just teach theory — we teach proven, practical strategies that work in today’s market. Our mission is to help loan officers close more loans and serve clients with excellence so they can build generational wealth through homeownership."
],
"tags":[
"Coaching + Training"
],
"offer":"Madison Chase Academy is a premier training platform created to help mortgage loan officers build profitable…",
"benefit":"",
"access":[
"All Members"
],
"connect":true,
"logo":"assets/content/vendors/madison-chase-academy.jpg",
"art":true
},
{
"name":"Million Dollar Minute",
"company":"Million Dollar Minute",
"short":"MDM",
"cat":"Coaching + Training",
"group":"Vendor Partner",
"g":[
"#7a1f55",
"#dd1969"
],
"desc":"The Million Dollar Minute course, Featuring Dale Vermillion, is a comprehensive program designed to teach you the strategies that are necessary to really master this competitive marketplace and to convert like a crazy person.",
"body":[
"The Million Dollar Minute course, Featuring Dale Vermillion, is a comprehensive program designed to teach you the strategies that are necessary to really master this competitive marketplace and to convert like a crazy person.",
"Having worked with over 1,000,000 lending professionals, Mortgage Champions has compiled the best practices of the nation’s top producers into a suite of practical, proven, and award-winning sales, service, and leadership systems.",
"As an AIME VIP member, you can access the Million Dollar Minute Program for only $199 About Mortgage Champions",
"Founded by 40-year industry veteran Dale Vermillion in 1996, Mortgage Champions has impacted over 600 companies, including some of the nations largest lenders. They have earned Excellence in Practice Awards from the Association for Training Development (ATD) and Brandon Hall Group (BHG) as well as a Torch Award for Ethics by the Better Business Bureau (BBB).",
"You can follow Mortgage Champions on LinkedIn and Facebook, subscribe to their newsletter , or checkout their podcast and other videos on YouTube .",
"About Dale Vermillion",
"Dale Vermillion was recently named to Mortgage Professional America’s Global Mortgage 100 List and has been a HousingWire Vanguard for two consecutive years. Dale was also named a Housing Industry Icon by Mortgage Professional America in 2021.",
"You can follow Dale on LinkedIn and Facebook for quick tips on navigating today’s market, or visit dalevermillion.com to explore all of his unique offerings!"
],
"tags":[
"Coaching + Training"
],
"offer":"As an AIME VIP member, you can access the Million Dollar Minute Program for only $199 About Mortgage Champions",
"benefit":"As an AIME VIP member, you can access the Million Dollar Minute Program for only $199 About Mortgage Champions",
"access":[
"VIP"
],
"connect":false,
"logo":"assets/content/vendors/million-dollar-minute.jpg",
"art":true,
"variant":[
"VIP"
]
},
{
"name":"Million Dollar Minute",
"company":"Million Dollar Minute",
"short":"MDM",
"cat":"Coaching + Training",
"group":"Vendor Partner",
"g":[
"#7a1f55",
"#dd1969"
],
"desc":"The Million Dollar Minute course, Featuring Dale Vermillion, is a comprehensive program designed to teach you the strategies that are necessary to really master this competitive marketplace and to convert like a crazy person.",
"body":[
"The Million Dollar Minute course, Featuring Dale Vermillion, is a comprehensive program designed to teach you the strategies that are necessary to really master this competitive marketplace and to convert like a crazy person.",
"Having worked with over 1,000,000 lending professionals, Mortgage Champions has compiled the best practices of the nation’s top producers into a suite of practical, proven, and award-winning sales, service, and leadership systems.",
"As an AIME Elite member, you can access the Million Dollar Minute Program for only $249 About Mortgage Champions",
"Founded by 40-year industry veteran Dale Vermillion in 1996, Mortgage Champions has impacted over 600 companies, including some of the nations largest lenders. They have earned Excellence in Practice Awards from the Association for Training Development (ATD) and Brandon Hall Group (BHG) as well as a Torch Award for Ethics by the Better Business Bureau (BBB).",
"You can follow Mortgage Champions on LinkedIn and Facebook, subscribe to their newsletter , or checkout their podcast and other videos on YouTube .",
"About Dale Vermillion",
"Dale Vermillion was recently named to Mortgage Professional America’s Global Mortgage 100 List and has been a HousingWire Vanguard for two consecutive years. Dale was also named a Housing Industry Icon by Mortgage Professional America in 2021.",
"You can follow Dale on LinkedIn and Facebook for quick tips on navigating today’s market, or visit dalevermillion.com to explore all of his unique offerings!"
],
"tags":[
"Coaching + Training"
],
"offer":"As an AIME Elite member, you can access the Million Dollar Minute Program for only $249 About Mortgage…",
"benefit":"As an AIME Elite member, you can access the Million Dollar Minute Program for only $249 About Mortgage Champions",
"access":[
"Elite"
],
"connect":false,
"logo":"assets/content/vendors/million-dollar-minute.jpg",
"art":true,
"variant":[
"Elite"
]
},
{
"name":"Million Dollar Minute",
"company":"Million Dollar Minute",
"short":"MDM",
"cat":"Coaching + Training",
"group":"Vendor Partner",
"g":[
"#7a1f55",
"#dd1969"
],
"desc":"The Million Dollar Minute course, Featuring Dale Vermillion, is a comprehensive program designed to teach you the strategies that are necessary to really master this competitive marketplace and to convert like a crazy person.",
"body":[
"The Million Dollar Minute course, Featuring Dale Vermillion, is a comprehensive program designed to teach you the strategies that are necessary to really master this competitive marketplace and to convert like a crazy person.",
"Having worked with over 1,000,000 lending professionals, Mortgage Champions has compiled the best practices of the nation’s top producers into a suite of practical, proven, and award-winning sales, service, and leadership systems.",
"As an AIME Premium member, you can access the Million Dollar Minute Program for only $299 About Mortgage Champions",
"Founded by 40-year industry veteran Dale Vermillion in 1996, Mortgage Champions has impacted over 600 companies, including some of the nations largest lenders. They have earned Excellence in Practice Awards from the Association for Training Development (ATD) and Brandon Hall Group (BHG) as well as a Torch Award for Ethics by the Better Business Bureau (BBB).",
"You can follow Mortgage Champions on LinkedIn and Facebook, subscribe to their newsletter , or checkout their podcast and other videos on YouTube .",
"About Dale Vermillion",
"Dale Vermillion was recently named to Mortgage Professional America’s Global Mortgage 100 List and has been a HousingWire Vanguard for two consecutive years. Dale was also named a Housing Industry Icon by Mortgage Professional America in 2021.",
"You can follow Dale on LinkedIn and Facebook for quick tips on navigating today’s market, or visit dalevermillion.com to explore all of his unique offerings!"
],
"tags":[
"Coaching + Training"
],
"offer":"As an AIME Premium member, you can access the Million Dollar Minute Program for only $299 About Mortgage…",
"benefit":"As an AIME Premium member, you can access the Million Dollar Minute Program for only $299 About Mortgage Champions",
"access":[
"Premium"
],
"connect":false,
"logo":"assets/content/vendors/million-dollar-minute.jpg",
"art":true,
"variant":[
"Premium"
]
},
{
"name":"MLO Force",
"company":"MLO Force",
"short":"MF",
"cat":"Education",
"group":"Vendor Partner",
"g":[
"#1b7a4a",
"#2bb673"
],
"desc":"Mortgage loan originators and brokers wield great power in the lives and dreams of American homeowners. With that power comes (you guessed it) great responsibility. MLO Force believes the mortgage journey should transcend the transactional and become transformational for the aspiring and existing homeowners we interact with. Our CE aims to bring out the best in every MLO—to be a mortgage hero to your borrowers; ethical, people-first, and ready to do what it takes to make a difference in their lives.",
"body":[
"Mortgage loan originators and brokers wield great power in the lives and dreams of American homeowners. With that power comes (you guessed it) great responsibility. MLO Force believes the mortgage journey should transcend the transactional and become transformational for the aspiring and existing homeowners we interact with. Our CE aims to bring out the best in every MLO—to be a mortgage hero to your borrowers; ethical, people-first, and ready to do what it takes to make a difference in their lives.",
"MLO Force offers fun-to-watch video training you can watch wherever you are (Cabo?). Hosts Nathan Knottingham and Sawyer Jones are committed to making you laugh at least once—or your money back.",
"Top-shelf mortgage education shouldn't mean top-shelf prices. This isn't Harvard (although it would be cool if it were). We're committed to giving you the best Continuing Education at the best price you'll find online.",
"Our goal is to fix CE's reputation by providing fun, conversational videos that bring out the best version of every loan originator: ethical, people-first heroes ready to do what it takes to make a difference in borrowers' lives."
],
"tags":[
"Education"
],
"offer":"Mortgage loan originators and brokers wield great power in the lives and dreams of American homeowners.",
"benefit":"",
"access":[
"All Members"
],
"connect":true,
"logo":"assets/content/vendors/mlo-force.jpg",
"art":true
},
{
"name":"MMIOne",
"company":"MMI",
"short":"M",
"cat":"Marketing",
"group":"Vendor Partner",
"g":[
"#86145a",
"#dd1969"
],
"desc":"The Unified Mortgage Growth Platform for Independent Brokers",
"body":[
"The Unified Mortgage Growth Platform for Independent Brokers",
"MMI One is a unified mortgage growth platform built to help independent brokers identify opportunity, strengthen referral relationships, and engage borrowers more effectively — all from one system. Designed specifically for how brokers operate, MMI One brings together trusted mortgage intelligence, borrower opportunity insights, and built-in communication tools so brokers can focus on relationships and production, not managing multiple platforms.",
"Market & Production Intelligence",
"Access comprehensive mortgage and market intelligence to research loan officers and agents, analyze production trends, benchmark performance, and identify high-value referral partners using interactive visual analytics.",
"Borrower & Refinance Opportunity Insights",
"Evaluate active mortgages across millions of properties to uncover refinance, cash-out, and payment improvement opportunities using automated valuation models and actionable equity insights.",
"Built-In Communication & Follow-Up",
"Connect with borrowers, agents, and partners via SMS, email, and voice directly within the platform. Automate follow-ups, manage conversations in one place, and stay consistently top of mind."
],
"tags":[
"Marketing"
],
"offer":"The Unified Mortgage Growth Platform for Independent Brokers",
"benefit":"",
"access":[
"All Members"
],
"connect":true,
"logo":"assets/content/vendors/mmione.png"
},
{
"name":"monday.com",
"company":"monday.com",
"short":"MC",
"cat":"CRM",
"group":"Affiliate",
"g":[
"#0b6b82",
"#20adce"
],
"desc":"The project management software that will actually work for your team!",
"body":[
"The project management software that will actually work for your team!",
"Plan, execute, and track projects of any size",
"Easily assign tasks and prioritize what's most important to your team. Set project timeline, milestones and dependencies, and manage your team’s entire workload all in one place.",
"The platform your team will actually love to use",
"Collaborate seamlessly across teams and departments to gain visibility into the progress of your work. Keep everyone aligned with a platform they will enjoy using to ensure a smoother execution.",
"100% customizable and flexible to fit any workflow",
"There are many ways to manage a single project. Shape your workflow the way that works for your team - for any project, process, department, or customer."
],
"tags":[
"CRM"
],
"offer":"The project management software that will actually work for your team!",
"benefit":"",
"access":[
"All Members"
],
"connect":false,
"logo":"assets/content/vendors/monday-com.jpg",
"art":true
},
{
"name":"MortgageCon",
"company":"MortgageCon",
"short":"M",
"cat":"Events",
"group":"Vendor Partner",
"g":[
"#0b1f5b",
"#163a85"
],
"desc":"MortgageCon, Inc. is a non-profit event company built for the mortgage and lending industry. Founded and led by Joe Motowidlak and Roberto, MortgageCon creates immersive, experience-driven events that bring mortgage professionals together for education, networking, and community — reimagining what an industry conference can feel like. As a non-profit, MortgageCon donates all profits to charity, so every ticket sold and every partnership formed helps give back beyond the industry itself.",
"body":[
"MortgageCon, Inc. is a non-profit event company built for the mortgage and lending industry. Founded and led by Joe Motowidlak and Roberto, MortgageCon creates immersive, experience-driven events that bring mortgage professionals together for education, networking, and community — reimagining what an industry conference can feel like. As a non-profit, MortgageCon donates all profits to charity, so every ticket sold and every partnership formed helps give back beyond the industry itself.",
"Based in Orlando, Florida, MortgageCon's repertoire is expanding to multiple events across the nation each year, from its flagship themed conferences to satellite gatherings in new markets nationwide. Each event is designed to be a standout experience — pairing high-quality industry content with the kind of immersive, memorable programming that keeps professionals coming back.",
"As a vendor partner, MortgageCon offers AIME members exclusive discounted pricing and early access to tickets across its full event slate, giving independent mortgage professionals a cost-effective way to attend high-quality, one-of-a-kind industry events alongside their peers."
],
"tags":[
"Events"
],
"offer":"As a vendor partner, MortgageCon offers AIME members exclusive discounted pricing and early access to tickets…",
"benefit":"As a vendor partner, MortgageCon offers AIME members exclusive discounted pricing and early access to tickets across its full event slate, giving independent mortgage professionals a cost-effective way to attend high-quality, one-of-a-kind industry events alongside their peers.",
"access":[
"All Members"
],
"connect":true,
"logo":"assets/content/vendors/mortgagecon.png"
},
{
"name":"My Credit Guy",
"company":"My Credit Guy",
"short":"MCG",
"cat":"Lead Generation",
"group":"Vendor Partner",
"g":[
"#4a217a",
"#7a3fb0"
],
"desc":"My Credit Guy is the trusted partner helping brokers turn more \"not yet\" buyers into homeowners by improving their credit. Their team of experts work closely with you and your clients to identify credit challenges, create actionable improvement plans, and accelerate loan approvals. Some key benefits include",
"body":[
"My Credit Guy is the trusted partner helping brokers turn more \"not yet\" buyers into homeowners by improving their credit. Their team of experts work closely with you and your clients to identify credit challenges, create actionable improvement plans, and accelerate loan approvals. Some key benefits include",
"Dedicated Account Executive Team : The Parker Team is here to help you get more clients to the closing table with direct-to-you video credit reviews",
"Marketing and Education Support : You’ll have access to customizable co-branded flyers, social media content, email templates and more!",
"Realtor Presentations : We’re available to assist with virtual Realtor education and training sessions.",
"More Closed Deals : Follow along with your clients in your custom tracking portal, and we will help turn credit challenges into opportunities and grow your business!"
],
"tags":[
"Lead Generation"
],
"offer":"My Credit Guy is the trusted partner helping brokers turn more \"not yet\" buyers into homeowners by improving…",
"benefit":"",
"access":[
"All Members"
],
"connect":true,
"logo":"assets/content/vendors/my-credit-guy.jpg",
"art":true
},
{
"name":"myhomeIQ",
"company":"myhomeIQ",
"short":"M",
"cat":"Customer Retention",
"group":"Vendor Partner",
"g":[
"#0b2a5b",
"#1893b1"
],
"desc":"myhomeIQ addresses the core challenges faced by mortgage professionals today, including client retention, building strong relationships with real estate agents, and effectively generating new business through data-driven marketing. myhomeIQ’s innovative platform is designed to tackle these challenges head-on and help you thrive in the industry.",
"body":[
"myhomeIQ addresses the core challenges faced by mortgage professionals today, including client retention, building strong relationships with real estate agents, and effectively generating new business through data-driven marketing. myhomeIQ’s innovative platform is designed to tackle these challenges head-on and help you thrive in the industry.",
"Key Features",
"Automated Personalized Client Communications",
"myhomeIQ ensures consistent and personalized engagement with your clients through monthly home reports. These reports keep you top-of-mind as their trusted advisor for all homeownership queries, thereby enhancing client retention.",
"Realtor Relationship Management",
"Access comprehensive data on real estate agents, including their transaction history and current partnerships. This feature helps identify top performers and establish strong, lasting relationships for ongoing referrals.",
"Active Home Shopper (Coming Soon)",
"This upcoming feature leverages real-time data to identify clients with high purchase intent. By analyzing geospatial and proprietary data, you can engage with potential buyers before the competition, optimizing marketing efforts and reducing acquisition costs."
],
"tags":[
"Customer Retention"
],
"offer":"myhomeIQ addresses the core challenges faced by mortgage professionals today, including client retention…",
"benefit":"",
"access":[
"All Members"
],
"connect":true,
"logo":"assets/content/vendors/myhomeiq.jpg",
"art":true
},
{
"name":"NordVPN",
"company":"NordVPN",
"short":"N",
"cat":"Cyber Security",
"group":"Affiliate",
"g":[
"#7a1f1a",
"#e0463c"
],
"desc":"The security you need, the features you’ll love",
"body":[
"The security you need, the features you’ll love",
"Easy VPN set up",
"Start using NordVPN with just a few clicks: get a plan, sign up, and tap the Quick Connect button to pick the best server for your network conditions.",
"Uninterrupted streaming",
"Watch your favorite content without any slowdown or interruption on all your devices, wherever you are – no limits on bandwidth or speed.",
"Next-generation encryption",
"Connect to a VPN server and be sure that NordVPN’s cutting-edge A-256 encryption keeps your online data safe, even on public Wi-Fi.",
"Malware protection"
],
"tags":[
"Cyber Security"
],
"offer":"The security you need, the features you’ll love",
"benefit":"",
"access":[
"All Members"
],
"connect":false,
"logo":"assets/content/vendors/nordvpn.jpg",
"art":true
},
{
"name":"One Rose Consulting",
"company":"One Rose Consulting",
"short":"ORC",
"cat":"Compliance",
"group":"Vendor Partner",
"g":[
"#0f5e3f",
"#1b9d6b"
],
"desc":"One Rose Consulting, LLC — Licensing & Compliance Made Easy!",
"body":[
"One Rose Consulting, LLC — Licensing & Compliance Made Easy!",
"One Rose Consulting, LLC is your trusted partner for mortgage licensing and compliance solutions nationwide. We specialize in helping brokers, lenders, and financial service providers navigate complex regulatory requirements with ease, providing end-to-end support that keeps your business audit-ready, compliant, and poised for growth.",
"Whether you're launching a new company, expanding into multiple states, or strengthening your internal compliance program, our team delivers tailored, audit-ready solutions designed around your unique needs. We offer a full suite of services—from multi-state licensing, MCR filings, and SAFE Act compliance to QC plan development, audit prep, and policy creation. Our deep industry knowledge and hands-on support help you stay focused on your business while we handle the back-office complexity.",
"At One Rose Consulting, we know that no two companies are alike. That’s why our services are fully customizable, and our approach is always personal. We work with you to build the operational foundation needed for long-term compliance, growth, and success.",
"As an approved AIME vendor, we’re proud to offer exclusive discounts, expedited onboarding, and white-glove service to AIME members. Whether you're a solo broker or a large lending operation, we’ll help you scale with confidence."
],
"tags":[
"Compliance"
],
"offer":"As an approved AIME vendor, we’re proud to offer exclusive discounts, expedited onboarding, and white-glove…",
"benefit":"As an approved AIME vendor, we’re proud to offer exclusive discounts, expedited onboarding, and white-glove service to AIME members. Whether you're a solo broker or a large lending operation, we’ll help you scale with confidence.",
"access":[
"Premium"
],
"connect":true,
"logo":"assets/content/vendors/one-rose-consulting.jpg",
"art":true,
"variant":[
"Premium"
]
},
{
"name":"One Rose Consulting",
"company":"One Rose Consulting",
"short":"ORC",
"cat":"Compliance",
"group":"Vendor Partner",
"g":[
"#0f5e3f",
"#1b9d6b"
],
"desc":"One Rose Consulting, LLC — Licensing & Compliance Made Easy!",
"body":[
"One Rose Consulting, LLC — Licensing & Compliance Made Easy!",
"One Rose Consulting, LLC is your trusted partner for mortgage licensing and compliance solutions nationwide. We specialize in helping brokers, lenders, and financial service providers navigate complex regulatory requirements with ease, providing end-to-end support that keeps your business audit-ready, compliant, and poised for growth.",
"Whether you're launching a new company, expanding into multiple states, or strengthening your internal compliance program, our team delivers tailored, audit-ready solutions designed around your unique needs. We offer a full suite of services—from multi-state licensing, MCR filings, and SAFE Act compliance to QC plan development, audit prep, and policy creation. Our deep industry knowledge and hands-on support help you stay focused on your business while we handle the back-office complexity.",
"At One Rose Consulting, we know that no two companies are alike. That’s why our services are fully customizable, and our approach is always personal. We work with you to build the operational foundation needed for long-term compliance, growth, and success.",
"As an approved AIME vendor, we’re proud to offer exclusive discounts, expedited onboarding, and white-glove service to AIME members. Whether you're a solo broker or a large lending operation, we’ll help you scale with confidence."
],
"tags":[
"Compliance"
],
"offer":"As an approved AIME vendor, we’re proud to offer exclusive discounts, expedited onboarding, and white-glove…",
"benefit":"As an approved AIME vendor, we’re proud to offer exclusive discounts, expedited onboarding, and white-glove service to AIME members. Whether you're a solo broker or a large lending operation, we’ll help you scale with confidence.",
"access":[
"Elite"
],
"connect":true,
"logo":"assets/content/vendors/one-rose-consulting.jpg",
"art":true,
"variant":[
"Elite"
]
},
{
"name":"One Rose Consulting-vip",
"company":"One Rose Consulting",
"short":"ORC",
"cat":"Compliance",
"group":"Vendor Partner",
"g":[
"#5b2a86",
"#a23fb0"
],
"desc":"One Rose Consulting, LLC — Licensing & Compliance Made Easy!",
"body":[
"One Rose Consulting, LLC — Licensing & Compliance Made Easy!",
"One Rose Consulting, LLC is your trusted partner for mortgage licensing and compliance solutions nationwide. We specialize in helping brokers, lenders, and financial service providers navigate complex regulatory requirements with ease, providing end-to-end support that keeps your business audit-ready, compliant, and poised for growth.",
"Whether you're launching a new company, expanding into multiple states, or strengthening your internal compliance program, our team delivers tailored, audit-ready solutions designed around your unique needs. We offer a full suite of services—from multi-state licensing, MCR filings, and SAFE Act compliance to QC plan development, audit prep, and policy creation. Our deep industry knowledge and hands-on support help you stay focused on your business while we handle the back-office complexity.",
"At One Rose Consulting, we know that no two companies are alike. That’s why our services are fully customizable, and our approach is always personal. We work with you to build the operational foundation needed for long-term compliance, growth, and success.",
"As an approved AIME vendor, we’re proud to offer exclusive discounts, expedited onboarding, and white-glove service to AIME members. Whether you're a solo broker or a large lending operation, we’ll help you scale with confidence."
],
"tags":[
"Compliance"
],
"offer":"As an approved AIME vendor, we’re proud to offer exclusive discounts, expedited onboarding, and white-glove…",
"benefit":"As an approved AIME vendor, we’re proud to offer exclusive discounts, expedited onboarding, and white-glove service to AIME members. Whether you're a solo broker or a large lending operation, we’ll help you scale with confidence.",
"access":[
"VIP"
],
"connect":true,
"logo":"assets/content/vendors/one-rose-consulting-vip.jpg",
"art":true
},
{
"name":"PropertyRadar",
"company":"PropertyRadar",
"short":"P",
"cat":"Data Intelligence",
"group":"Vendor Partner",
"g":[
"#7a1f55",
"#dd1969"
],
"desc":"BUILD A PIPELINE FULL OF FASTBALLS",
"body":[
"BUILD A PIPELINE FULL OF FASTBALLS",
"PropertyRadar helps loan officers use AI to cherry-pick the exact borrowers and loans they want to work - by loan type, loan amount, LTV, equity position, occupancy, property type, origination date, and more.",
"Instead of paying for broad lead lists filled with deals you do not want, PropertyRadar lets you define your ideal opportunity and build a targeted pipeline around the loans you close best.",
"Some key features include",
"Write your own commission checks: Target the loan amounts, programs, and borrower profiles that align with your income goals and capacity.",
"Turn investor guidelines into lead lists: Enter the criteria from a rate sheet or special loan program and identify homeowners who closely match the opportunity.",
"Build a cleaner, faster pipeline: Filter for property, mortgage, equity, ownership, and lien characteristics before spending money on outreach.",
"AIME members receive an additional 5% off PropertyRadar’s already affordable standard individual subscription!"
],
"tags":[
"Data Intelligence"
],
"offer":"AIME members receive an additional 5% off PropertyRadar’s already affordable standard individual subscription!",
"benefit":"AIME members receive an additional 5% off PropertyRadar’s already affordable standard individual subscription!",
"access":[
"All Members"
],
"connect":true,
"logo":"assets/content/vendors/propertyradar.png"
},
{
"name":"QuickBooks",
"company":"QuickBooks",
"short":"Q",
"cat":"Banking",
"group":"Affiliate",
"g":[
"#1b7a4a",
"#2bb673"
],
"desc":"No need to be an accounting expert",
"body":[
"No need to be an accounting expert",
"QuickBooks keeps everything organized in one place, so you’re tax ready all the time. Easy-to-read reports and dashboards help you make smarter business decisions. 98% of customers agree it’s a simpler way to manage their business.*",
"Simplify everyday accounting",
"You can access QuickBooks from the web or your mobile devices, making it simple to send invoices, save receipts, and add expense when you’re on the go. Join QuickBooks users who get back an average of 42 hours per month using QuickBooks.**",
"Easily manage income, expenses, and more. Organized and in one place."
],
"tags":[
"Banking"
],
"offer":"No need to be an accounting expert",
"benefit":"",
"access":[
"All Members"
],
"connect":false,
"logo":"assets/content/vendors/quickbooks.jpg",
"art":true
},
{
"name":"Rad CRM",
"company":"Rad CRM",
"short":"RC",
"cat":"CRM",
"group":"Vendor Partner",
"g":[
"#86145a",
"#dd1969"
],
"desc":"Rad CRM is crafted exclusively for loan officers, by loan officers. Streamline your business and close more deals with our intuitive tools and features. Connect and build your realtor relationships. Our platform offers powerful tools and features to double your production. From customizable landing pages to automated email campaigns, we provide everything you need to expand your client base and grow your business. Let The Rad CRM help you maximize your potential!",
"body":[
"Rad CRM is crafted exclusively for loan officers, by loan officers. Streamline your business and close more deals with our intuitive tools and features. Connect and build your realtor relationships. Our platform offers powerful tools and features to double your production. From customizable landing pages to automated email campaigns, we provide everything you need to expand your client base and grow your business. Let The Rad CRM help you maximize your potential!"
],
"tags":[
"CRM"
],
"offer":"Rad CRM is crafted exclusively for loan officers, by loan officers.",
"benefit":"",
"access":[
"All Members"
],
"connect":true,
"logo":"assets/content/vendors/rad-crm.jpg",
"art":true
},
{
"name":"Rapidio",
"company":"Rapidio",
"short":"R",
"cat":"Origination Tools",
"group":"Vendor Partner",
"g":[
"#0b6b82",
"#20adce"
],
"desc":"At Rapidio, we’re transforming the way mortgage professionals handle income calculations, document processing, and underwriting decisions with AI-powered automation that delivers accurate, guideline-compliant results.",
"body":[
"At Rapidio, we’re transforming the way mortgage professionals handle income calculations, document processing, and underwriting decisions with AI-powered automation that delivers accurate, guideline-compliant results.",
"Say goodbye to manual errors and delays. Rapidio ensures 100% accuracy and full compliance with FHA, USDA, Non-QM, Fannie Mae, and Freddie Mac guidelines. Our system effortlessly processes W-2s, paystubs, bank statements, Personal & Business Tax returns and much more, giving you clear, underwriting-ready results with complete transparency.",
"But we don’t stop at calculations. Rapidio also provides intelligent document classification, guideline-based conditions, and real-time analytics—helping you close loans faster with less back-and-forth. We also make sure you always have access to our QC team so you can discuss your results with a human representative."
],
"tags":[
"Origination Tools"
],
"offer":"At Rapidio, we’re transforming the way mortgage professionals handle income calculations, document…",
"benefit":"",
"access":[
"Elite"
],
"connect":true,
"logo":"assets/content/vendors/rapidio.jpg",
"art":true,
"variant":[
"Elite"
]
},
{
"name":"Rapidio",
"company":"Rapidio",
"short":"R",
"cat":"Origination Tools",
"group":"Vendor Partner",
"g":[
"#0b6b82",
"#20adce"
],
"desc":"At Rapidio, we’re transforming the way mortgage professionals handle income calculations, document processing, and underwriting decisions with AI-powered automation that delivers accurate, guideline-compliant results.",
"body":[
"At Rapidio, we’re transforming the way mortgage professionals handle income calculations, document processing, and underwriting decisions with AI-powered automation that delivers accurate, guideline-compliant results.",
"Say goodbye to manual errors and delays. Rapidio ensures 100% accuracy and full compliance with FHA, USDA, Non-QM, Fannie Mae, and Freddie Mac guidelines. Our system effortlessly processes W-2s, paystubs, bank statements, Personal & Business Tax returns and much more, giving you clear, underwriting-ready results with complete transparency.",
"But we don’t stop at calculations. Rapidio also provides intelligent document classification, guideline-based conditions, and real-time analytics—helping you close loans faster with less back-and-forth. We also make sure you always have access to our QC team so you can discuss your results with a human representative."
],
"tags":[
"Origination Tools"
],
"offer":"At Rapidio, we’re transforming the way mortgage professionals handle income calculations, document…",
"benefit":"",
"access":[
"Premium"
],
"connect":true,
"logo":"assets/content/vendors/rapidio.jpg",
"art":true,
"variant":[
"Premium"
]
},
{
"name":"Rapidio",
"company":"Rapidio",
"short":"R",
"cat":"Origination Tools",
"group":"Vendor Partner",
"g":[
"#0b6b82",
"#20adce"
],
"desc":"At Rapidio, we’re transforming the way mortgage professionals handle income calculations, document processing, and underwriting decisions with AI-powered automation that delivers accurate, guideline-compliant results.",
"body":[
"At Rapidio, we’re transforming the way mortgage professionals handle income calculations, document processing, and underwriting decisions with AI-powered automation that delivers accurate, guideline-compliant results.",
"Say goodbye to manual errors and delays. Rapidio ensures 100% accuracy and full compliance with FHA, USDA, Non-QM, Fannie Mae, and Freddie Mac guidelines. Our system effortlessly processes W-2s, paystubs, bank statements, Personal & Business Tax returns and much more, giving you clear, underwriting-ready results with complete transparency.",
"But we don’t stop at calculations. Rapidio also provides intelligent document classification, guideline-based conditions, and real-time analytics—helping you close loans faster with less back-and-forth. We also make sure you always have access to our QC team so you can discuss your results with a human representative."
],
"tags":[
"Origination Tools"
],
"offer":"At Rapidio, we’re transforming the way mortgage professionals handle income calculations, document…",
"benefit":"",
"access":[
"VIP"
],
"connect":true,
"logo":"assets/content/vendors/rapidio.jpg",
"art":true,
"variant":[
"VIP"
]
},
{
"name":"RETR",
"company":"RETR",
"short":"R",
"cat":"Data Intelligence",
"group":"Vendor Partner",
"g":[
"#0b1f5b",
"#163a85"
],
"desc":"RETR is a different kind of mortgage and real estate data platform, bootstrapped and built by engineers with real industry experience. See which agents are closing, who they work with, and when their next open house is. Mine your past clients for refi opportunities, and send them monthly Home Value Reports. Check out our Google Reviews to see what LOs are saying! Or better yet, start a free trial and we’ll show you how to turn the data into loans for a lifetime!",
"body":[
"RETR is a different kind of mortgage and real estate data platform, bootstrapped and built by engineers with real industry experience. See which agents are closing, who they work with, and when their next open house is. Mine your past clients for refi opportunities, and send them monthly Home Value Reports. Check out our Google Reviews to see what LOs are saying! Or better yet, start a free trial and we’ll show you how to turn the data into loans for a lifetime!"
],
"tags":[
"Data Intelligence"
],
"offer":"RETR is a different kind of mortgage and real estate data platform, bootstrapped and built by engineers with…",
"benefit":"",
"access":[
"All Members"
],
"connect":true,
"logo":"assets/content/vendors/retr.jpg",
"art":true
},
{
"name":"Roam",
"company":"Roam",
"short":"R",
"cat":"Business Ops",
"group":"Vendor Partner",
"g":[
"#4a217a",
"#7a3fb0"
],
"desc":"Roam is the Office of the Future: AI Coworkers and People collaborating in an All-in-One Virtual HQ. Unite your loan originators, branch managers, processors, support staff, and even partners all in one AI-powered Virtual HQ. Supercharge productivity, build culture, scale operations, and close loans faster . Roam includes",
"body":[
"Roam is the Office of the Future: AI Coworkers and People collaborating in an All-in-One Virtual HQ. Unite your loan originators, branch managers, processors, support staff, and even partners all in one AI-powered Virtual HQ. Supercharge productivity, build culture, scale operations, and close loans faster . Roam includes",
"Interactive Map : A company-wide Visualization with Live Presence. A live view of who’s in the office, who’s not, who’s meeting with whom, and more. It’s a shared, real-time interface that makes your whole company feel as if everyone’s in one room, from anywhere.",
"Drop-in Meetings : Knock on an empty seat in someone’s private office to start an audio-only Drop-In Meeting. If they want to talk, they’ll accept your knock.",
"Video Conferencing : Pop into a Meeting Room for video conferencing when you want to collaborate. No more back-to-back video meetings all day. Just meet when you need to.",
"Enterprise Chat : Send Direct Messages, Group Chats, or Confidential Chats. Roam Chat has it all - threading, pinning, folders, files, reactions, integrations, and more.",
"AI-Powered Note Taking : Get an AI-generated summary of your meeting complete with action items. You can prompt the summary to reformat it or get answers about certain parts of the meeting. And if you’re late to a meeting, you’ll get an automated AI-catch-me-up.",
"Scheduling : Send your Lobby link to guests to book time with you on your calendar. Configure different links with custom time and availability settings depending on context.",
"Theater : Take your All-Hands meetings and webinars to the next level with a unique new Theater. Your audience sits in rows where they can whisper to each other. There’s a backstage, Q&A microphone, and stadium mode."
],
"tags":[
"Business Ops"
],
"offer":"Roam is the Office of the Future: AI Coworkers and People collaborating in an All-in-One Virtual HQ.",
"benefit":"",
"access":[
"All Members"
],
"connect":true,
"logo":"assets/content/vendors/roam.jpg",
"art":true
},
{
"name":"Sequifi",
"company":"Sequifi",
"short":"S",
"cat":"Business Ops",
"group":"Vendor Partner",
"g":[
"#0b2a5b",
"#1893b1"
],
"desc":"Sequifi is the commission, payroll and HR platform built for mortgage brokerages. We help you pay your whole team accurately on every funded loan, from LOs to branch managers and processors, without rebuilding comp in spreadsheets every time a plan changes.",
"body":[
"Sequifi is the commission, payroll and HR platform built for mortgage brokerages. We help you pay your whole team accurately on every funded loan, from LOs to branch managers and processors, without rebuilding comp in spreadsheets every time a plan changes.",
"Funded loans sync in from Encompass, LendingPad, Arive, Calyx and other major LOS platforms. From there, Sequifi applies your comp plans automatically, whether they use bps by volume tier, branch overrides, processor and LOA splits, draws, bonuses or clawbacks on buybacks. Your ops team reviews and approves every line before anything pays.",
"Sequifi runs W-2 and 1099 payroll from the same approved numbers, so there’s no exporting or re-keying, and same-day pay is available. New loan officers are onboarded with NMLS records, W-9s and their comp plan attached before their first loan. Every LO gets the Sequifi app to see exactly how each commission was calculated, before payday.",
"Whether you have five loan officers or several hundred, our team sets up your comp plans, connects your loan data and payroll, and trains your ops team, managers and LOs. You can also start with commissions only and move payroll over when you’re ready.",
"AIME members get $500 off the Sequifi implementation fee. Book a 20-minute demo and we’ll model your comp plan on a loan that looks like yours!"
],
"tags":[
"Business Ops"
],
"offer":"AIME members get $500 off the Sequifi implementation fee.",
"benefit":"AIME members get $500 off the Sequifi implementation fee. Book a 20-minute demo and we’ll model your comp plan on a loan that looks like yours!",
"access":[
"All Members"
],
"connect":true,
"logo":"assets/content/vendors/sequifi.png"
},
{
"name":"Stikkum",
"company":"Stikkum",
"short":"S",
"cat":"Customer Retention",
"group":"Vendor Partner",
"g":[
"#7a1f1a",
"#e0463c"
],
"desc":"Stikkum is a technology company offering innovative solutions that help mortgage brokers streamline operations and grow their businesses. Our platform provides essential tools for improving client retention, automating marketing, and enhancing efficiency in today’s competitive mortgage market. Key solutions include automated client retention workflows, real-time EPO (Early Payoff) alerts, customizable marketing templates, and seamless CRM integration.",
"body":[
"Stikkum is a technology company offering innovative solutions that help mortgage brokers streamline operations and grow their businesses. Our platform provides essential tools for improving client retention, automating marketing, and enhancing efficiency in today’s competitive mortgage market. Key solutions include automated client retention workflows, real-time EPO (Early Payoff) alerts, customizable marketing templates, and seamless CRM integration.",
"These features help brokers stay connected with clients post-loan, receive timely early payoff notifications, and automate marketing to boost engagement with clients and referral partners. Stikkum’s dedicated support team is available seven days a week, ensuring that brokers have the assistance they need to succeed. We’re committed to providing brokers with the technology to maximize efficiency, foster strong client relationships, and drive business growth."
],
"tags":[
"Customer Retention"
],
"offer":"Stikkum is a technology company offering innovative solutions that help mortgage brokers streamline…",
"benefit":"",
"access":[
"Premium"
],
"connect":true,
"logo":"assets/content/vendors/stikkum.jpg",
"art":true,
"variant":[
"Premium"
]
},
{
"name":"Stikkum",
"company":"Stikkum",
"short":"S",
"cat":"Customer Retention",
"group":"Vendor Partner",
"g":[
"#7a1f1a",
"#e0463c"
],
"desc":"Stikkum is a technology company offering innovative solutions that help mortgage brokers streamline operations and grow their businesses. Our platform provides essential tools for improving client retention, automating marketing, and enhancing efficiency in today’s competitive mortgage market. Key solutions include automated client retention workflows, real-time EPO (Early Payoff) alerts, customizable marketing templates, and seamless CRM integration.",
"body":[
"Stikkum is a technology company offering innovative solutions that help mortgage brokers streamline operations and grow their businesses. Our platform provides essential tools for improving client retention, automating marketing, and enhancing efficiency in today’s competitive mortgage market. Key solutions include automated client retention workflows, real-time EPO (Early Payoff) alerts, customizable marketing templates, and seamless CRM integration.",
"These features help brokers stay connected with clients post-loan, receive timely early payoff notifications, and automate marketing to boost engagement with clients and referral partners. Stikkum’s dedicated support team is available seven days a week, ensuring that brokers have the assistance they need to succeed. We’re committed to providing brokers with the technology to maximize efficiency, foster strong client relationships, and drive business growth."
],
"tags":[
"Customer Retention"
],
"offer":"Stikkum is a technology company offering innovative solutions that help mortgage brokers streamline…",
"benefit":"",
"access":[
"VIP"
],
"connect":true,
"logo":"assets/content/vendors/stikkum.jpg",
"art":true,
"variant":[
"VIP"
]
},
{
"name":"Stikkum",
"company":"Stikkum",
"short":"S",
"cat":"Customer Retention",
"group":"Vendor Partner",
"g":[
"#7a1f1a",
"#e0463c"
],
"desc":"Stikkum is a technology company offering innovative solutions that help mortgage brokers streamline operations and grow their businesses. Our platform provides essential tools for improving client retention, automating marketing, and enhancing efficiency in today’s competitive mortgage market. Key solutions include automated client retention workflows, real-time EPO (Early Payoff) alerts, customizable marketing templates, and seamless CRM integration.",
"body":[
"Stikkum is a technology company offering innovative solutions that help mortgage brokers streamline operations and grow their businesses. Our platform provides essential tools for improving client retention, automating marketing, and enhancing efficiency in today’s competitive mortgage market. Key solutions include automated client retention workflows, real-time EPO (Early Payoff) alerts, customizable marketing templates, and seamless CRM integration.",
"These features help brokers stay connected with clients post-loan, receive timely early payoff notifications, and automate marketing to boost engagement with clients and referral partners. Stikkum’s dedicated support team is available seven days a week, ensuring that brokers have the assistance they need to succeed. We’re committed to providing brokers with the technology to maximize efficiency, foster strong client relationships, and drive business growth."
],
"tags":[
"Customer Retention"
],
"offer":"Stikkum is a technology company offering innovative solutions that help mortgage brokers streamline…",
"benefit":"",
"access":[
"Elite"
],
"connect":true,
"logo":"assets/content/vendors/stikkum.jpg",
"art":true,
"variant":[
"Elite"
]
},
{
"name":"Strategic Compliance Partners",
"company":"Strategic Compliance Partners",
"short":"SCP",
"cat":"Compliance",
"group":"Vendor Partner",
"g":[
"#0f5e3f",
"#1b9d6b"
],
"desc":"USE CODE \" AIMEMem \" FOR WAIVED SETUP FEE",
"body":[
"USE CODE \" AIMEMem \" FOR WAIVED SETUP FEE",
"Strategic Compliance Partners is committed to making the licensing and compliance process easier for mortgage brokers across the nation. Whether it's basic needs or assistance with complex tasks, we're here to support and fuel your brokerage's growth.",
"Strategic Compliance Partners partnered with Artemis to bring you Compliance Outsource—a game-changing solution built exclusively for brokers to simplify your compliance processes and operational requirements to give you back valuable time to focus on your business. Here’s how Compliance Outsource can help your business thrive",
"Comprehensive Compliance Management : Gain access to all the essential documents and tools you already rely on from SCP. Hands-Free Execution : Leave the time-consuming compliance tasks to Artemis while you focus on growing your business. Peace of Mind : Rest easy knowing your compliance is handled, allowing you to dedicate more time to your clients."
],
"tags":[
"Compliance"
],
"offer":"USE CODE \" AIMEMem \" FOR WAIVED SETUP FEE",
"benefit":"",
"access":[
"All Members"
],
"connect":true,
"logo":"assets/content/vendors/strategic-compliance-partners.jpg",
"art":true
},
{
"name":"Surety Bonds",
"company":"Surety Bonds",
"short":"SB",
"cat":"Surety Bonds",
"group":"Vendor Partner",
"g":[
"#5b2a86",
"#a23fb0"
],
"desc":"Surety Bonds",
"body":[
"Surety Bonds",
"CA rates: $7 per $1,000.00 of coverage for one year",
"All other states: $5 per $1,000.00 of coverage for one year",
"These rates are available for applicants that qualify, subject to the following",
"FICO score of 650+",
"No bankruptcies and no tax liens",
"Company financials required for any bond amount $100K",
"Each submission will be individually underwritten"
],
"tags":[
"Surety Bonds"
],
"offer":"Surety Bonds",
"benefit":"",
"access":[
"All Members"
],
"connect":false,
"logo":"assets/content/vendors/surety-bonds.jpg",
"art":true
},
{
"name":"The Defining Difference",
"company":"The Defining Difference",
"short":"TDD",
"cat":"Coaching + Training",
"group":"Vendor Partner",
"g":[
"#7a1f55",
"#dd1969"
],
"desc":"Founded by Cindy Ertman, a nationally recognized mortgage coach and former Top 100 Mortgage Loan Originator in the U.S. for over a decade, The Defining Difference® offers proven strategies based on real-world success. Cindy has helped thousands of mortgage professionals increase production, build lasting referral relationships, and create financial freedom—and now, you can benefit from her expertise, too! Her coaching and training programs are designed to help you master the power of bold, intentional choices—because real success isn’t just about growing your business, it’s about elevating your life too.",
"body":[
"Founded by Cindy Ertman, a nationally recognized mortgage coach and former Top 100 Mortgage Loan Originator in the U.S. for over a decade, The Defining Difference® offers proven strategies based on real-world success. Cindy has helped thousands of mortgage professionals increase production, build lasting referral relationships, and create financial freedom—and now, you can benefit from her expertise, too! Her coaching and training programs are designed to help you master the power of bold, intentional choices—because real success isn’t just about growing your business, it’s about elevating your life too.",
"At The Defining Difference®, we give mortgage professionals the proven strategies, systems, scripts, and tools to dominate in any market. Whether you want to build a consistent lead generation referral system, create the systems to scall your production or simply learn how to manage your day- our elite coaching framework delivers real, measurable results. Success isn’t a guessing game—it’s a formula, and we help you master it.",
"Comprehensive Coaching to Match Your Ambition",
"Exclusive Monthly Group Coaching & Community – Stay inspired, motivated, and on track with Cindy Ertman’s high-level online group coaching. Receive powerful coaching from Cindy and other guest experts who share their industry secrets for massive success. Network with top mortgage professionals nationwide, gain real-time market insights, and tap into proven strategies to scale your business and income.",
"One-on-One Private Coaching – Get personalized, high-impact mentorship by Cindy Ertman’s “boots on the ground” team of highly esteemed mortgage coaches- designed to help you overcome challenges, maximize growth, and fast-track your success.",
"Elite Mastermind Groups – Surround yourself with top-producing mortgage professionals in an exclusive, high-performance environment designed to fuel exponential business growth and long-term success.",
"Why Choose The Defining Difference?",
"What sets us apart isn’t just our expertise—it’s our heart-centered approach. We don’t just teach success principles; we partner with you to ensure your growth extends beyond business into every aspect of your life. Our mission is to empower you to break through limitations, create financial freedom, and build a career you love while maintaining balance and fulfillment."
],
"tags":[
"Coaching + Training"
],
"offer":"Founded by Cindy Ertman, a nationally recognized mortgage coach and former Top 100 Mortgage Loan Originator…",
"benefit":"",
"access":[
"VIP"
],
"connect":true,
"logo":"assets/content/vendors/the-defining-difference.jpg",
"art":true,
"variant":[
"VIP"
]
},
{
"name":"The Defining Difference",
"company":"The Defining Difference",
"short":"TDD",
"cat":"Coaching + Training",
"group":"Vendor Partner",
"g":[
"#7a1f55",
"#dd1969"
],
"desc":"Founded by Cindy Ertman, a nationally recognized mortgage coach and former Top 100 Mortgage Loan Originator in the U.S. for over a decade, The Defining Difference® offers proven strategies based on real-world success. Cindy has helped thousands of mortgage professionals increase production, build lasting referral relationships, and create financial freedom—and now, you can benefit from her expertise, too! Her coaching and training programs are designed to help you master the power of bold, intentional choices—because real success isn’t just about growing your business, it’s about elevating your life too.",
"body":[
"Founded by Cindy Ertman, a nationally recognized mortgage coach and former Top 100 Mortgage Loan Originator in the U.S. for over a decade, The Defining Difference® offers proven strategies based on real-world success. Cindy has helped thousands of mortgage professionals increase production, build lasting referral relationships, and create financial freedom—and now, you can benefit from her expertise, too! Her coaching and training programs are designed to help you master the power of bold, intentional choices—because real success isn’t just about growing your business, it’s about elevating your life too.",
"At The Defining Difference®, we give mortgage professionals the proven strategies, systems, scripts, and tools to dominate in any market. Whether you want to build a consistent lead generation referral system, create the systems to scall your production or simply learn how to manage your day- our elite coaching framework delivers real, measurable results. Success isn’t a guessing game—it’s a formula, and we help you master it.",
"Comprehensive Coaching to Match Your Ambition",
"Exclusive Monthly Group Coaching & Community – Stay inspired, motivated, and on track with Cindy Ertman’s high-level online group coaching. Receive powerful coaching from Cindy and other guest experts who share their industry secrets for massive success. Network with top mortgage professionals nationwide, gain real-time market insights, and tap into proven strategies to scale your business and income.",
"One-on-One Private Coaching – Get personalized, high-impact mentorship by Cindy Ertman’s “boots on the ground” team of highly esteemed mortgage coaches- designed to help you overcome challenges, maximize growth, and fast-track your success.",
"Elite Mastermind Groups – Surround yourself with top-producing mortgage professionals in an exclusive, high-performance environment designed to fuel exponential business growth and long-term success.",
"Why Choose The Defining Difference?",
"What sets us apart isn’t just our expertise—it’s our heart-centered approach. We don’t just teach success principles; we partner with you to ensure your growth extends beyond business into every aspect of your life. Our mission is to empower you to break through limitations, create financial freedom, and build a career you love while maintaining balance and fulfillment."
],
"tags":[
"Coaching + Training"
],
"offer":"Founded by Cindy Ertman, a nationally recognized mortgage coach and former Top 100 Mortgage Loan Originator…",
"benefit":"",
"access":[
"Elite"
],
"connect":true,
"logo":"assets/content/vendors/the-defining-difference.jpg",
"art":true,
"variant":[
"Elite"
]
},
{
"name":"The Defining Difference",
"company":"The Defining Difference",
"short":"TDD",
"cat":"Coaching + Training",
"group":"Vendor Partner",
"g":[
"#7a1f55",
"#dd1969"
],
"desc":"Founded by Cindy Ertman, a nationally recognized mortgage coach and former Top 100 Mortgage Loan Originator in the U.S. for over a decade, The Defining Difference® offers proven strategies based on real-world success. Cindy has helped thousands of mortgage professionals increase production, build lasting referral relationships, and create financial freedom—and now, you can benefit from her expertise, too! Her coaching and training programs are designed to help you master the power of bold, intentional choices—because real success isn’t just about growing your business, it’s about elevating your life too.",
"body":[
"Founded by Cindy Ertman, a nationally recognized mortgage coach and former Top 100 Mortgage Loan Originator in the U.S. for over a decade, The Defining Difference® offers proven strategies based on real-world success. Cindy has helped thousands of mortgage professionals increase production, build lasting referral relationships, and create financial freedom—and now, you can benefit from her expertise, too! Her coaching and training programs are designed to help you master the power of bold, intentional choices—because real success isn’t just about growing your business, it’s about elevating your life too.",
"At The Defining Difference®, we give mortgage professionals the proven strategies, systems, scripts, and tools to dominate in any market. Whether you want to build a consistent lead generation referral system, create the systems to scall your production or simply learn how to manage your day- our elite coaching framework delivers real, measurable results. Success isn’t a guessing game—it’s a formula, and we help you master it.",
"Comprehensive Coaching to Match Your Ambition",
"Exclusive Monthly Group Coaching & Community – Stay inspired, motivated, and on track with Cindy Ertman’s high-level online group coaching. Receive powerful coaching from Cindy and other guest experts who share their industry secrets for massive success. Network with top mortgage professionals nationwide, gain real-time market insights, and tap into proven strategies to scale your business and income.",
"One-on-One Private Coaching – Get personalized, high-impact mentorship by Cindy Ertman’s “boots on the ground” team of highly esteemed mortgage coaches- designed to help you overcome challenges, maximize growth, and fast-track your success.",
"Elite Mastermind Groups – Surround yourself with top-producing mortgage professionals in an exclusive, high-performance environment designed to fuel exponential business growth and long-term success.",
"Why Choose The Defining Difference?",
"What sets us apart isn’t just our expertise—it’s our heart-centered approach. We don’t just teach success principles; we partner with you to ensure your growth extends beyond business into every aspect of your life. Our mission is to empower you to break through limitations, create financial freedom, and build a career you love while maintaining balance and fulfillment."
],
"tags":[
"Coaching + Training"
],
"offer":"Founded by Cindy Ertman, a nationally recognized mortgage coach and former Top 100 Mortgage Loan Originator…",
"benefit":"",
"access":[
"Premium"
],
"connect":true,
"logo":"assets/content/vendors/the-defining-difference.jpg",
"art":true,
"variant":[
"Premium"
]
},
{
"name":"Vertisure",
"company":"Vertisure",
"short":"V",
"cat":"Insurance Solutions",
"group":"Vendor Partner",
"g":[
"#1b7a4a",
"#2bb673"
],
"desc":"Vertisure is designed to be a true partner with Loan Originators. Simply upload your 1003 into their portal, and you will receive an instant quote in your inbox. Your client's experience is their top priority. LOs are encouraged to get their insurance license and share in the insurance residual revenue. Vertisure is licensed in 50 states as an insurance broker with dozens of carrier options, so you know your clients are getting the best coverage available in the marketplace.",
"body":[
"Vertisure is designed to be a true partner with Loan Originators. Simply upload your 1003 into their portal, and you will receive an instant quote in your inbox. Your client's experience is their top priority. LOs are encouraged to get their insurance license and share in the insurance residual revenue. Vertisure is licensed in 50 states as an insurance broker with dozens of carrier options, so you know your clients are getting the best coverage available in the marketplace."
],
"tags":[
"Insurance Solutions"
],
"offer":"Vertisure is designed to be a true partner with Loan Originators.",
"benefit":"",
"access":[
"All Members"
],
"connect":true,
"logo":"assets/content/vendors/vertisure.jpg",
"art":true
},
{
"name":"Vetted VA",
"company":"Vetted VA",
"short":"VV",
"cat":"Education",
"group":"Vendor Partner",
"g":[
"#86145a",
"#dd1969"
],
"desc":"This package includes one-year access to the full Vetted VA training library. Reservists can learn about VA loans by taking the Basic Movement courses, Practical Application courses, General Support training courses, plus access to our professional resources. We are continuously integrating training based around real world situations and mortgage/real estate changes that the Veteran and professional communities need help with. This means scrutinizing updated guidelines, problem solving, and hearing directly from our agents, lenders, processors, appraisers, VA staff personnel and (of course) Veterans and more on VA loan problems they are facing!",
"body":[
"This package includes one-year access to the full Vetted VA training library. Reservists can learn about VA loans by taking the Basic Movement courses, Practical Application courses, General Support training courses, plus access to our professional resources. We are continuously integrating training based around real world situations and mortgage/real estate changes that the Veteran and professional communities need help with. This means scrutinizing updated guidelines, problem solving, and hearing directly from our agents, lenders, processors, appraisers, VA staff personnel and (of course) Veterans and more on VA loan problems they are facing!",
"This is over 24 hours of Training content that can be taken at your own speed!"
],
"tags":[
"Education"
],
"offer":"This package includes one-year access to the full Vetted VA training library.",
"benefit":"",
"access":[
"All Members"
],
"connect":true,
"logo":"assets/content/vendors/vetted-va.jpg",
"art":true
}
],
"resources":[
{
"title":"Mortgage Mornings | June 24th, 2026",
"type":"Podcast",
"cta":"Listen now",
"dur":"Jun 24, 2026",
"pub":"2026-06-24",
"sub":"feat. Jason Frazier & Jonathon Haddad",
"series":"Mortgage Mornings",
"show":"Mortgage Mornings",
"goal":"Close More Loans",
"topic":"Loan Products & Guidelines",
"g":[
"#0b2a5b",
"#e0463c"
],
"access":[
"All Members"
],
"body":[
"This week's episode of Mortgage Mornings focused on scaling a mortgage business through systems, delegation, and execution over endless planning.",
"Todd Albrecht from Edge shared how he built a team of nearly 20 people with only three salaried positions, relying on commission based partners who are required to be licensed. He emphasized that originators cannot scale in chaos and stressed the importance of documenting workflows, finding good mentorship, and spending 80% of time on implementation rather than just design.",
"The group discussed team structures, including front end, middle, and back end systems, with team members working 40 hour weeks and taking one week of completely unstructured time each quarter.",
"The meeting wrapped up with a reminder that AI will never replace human connection in mortgage transactions, and an announcement about Fuse on September 23rd featuring a truck giveaway."
],
"points":[],
"img":"assets/content/resources/mortgage-mornings-june-24th-2026.jpg"
},
{
"title":"The 'Daily Six' Challenge (Part 3)",
"type":"Podcast",
"cta":"Listen now",
"dur":"Jun 22, 2026",
"pub":"2026-06-22",
"sub":"AIME Accelerate",
"series":"Accelerate",
"show":"AIME Accelerate",
"goal":"Mindset & Habits",
"topic":"Mindset & Habits",
"g":[
"#5b2a86",
"#dd1969"
],
"access":[
"All Members"
],
"body":[
"A 60-Minute Check-In for Loan Officers who are past the hype and hitting the hard part.",
"No sugarcoating. No motivational fluff. Just an honest conversation about why week three is where most people quit—and how to push through anyway.",
"What You'll Walk Away With",
"A three-move framework to beat resistance when the novelty wears off.",
"A vulnerability audit to find your lowest-scoring days and fix the pattern.",
"A one-sentence intention that keeps you accountable when no one's watching."
],
"points":[],
"img":"assets/content/resources/the-daily-six-challenge-part-3.jpg"
},
{
"title":"Broker to Broker Podcast: Episode 251",
"type":"Podcast",
"cta":"Listen now",
"dur":"Jun 22, 2026",
"pub":"2026-06-22",
"sub":"feat. Ryan Whitfield",
"series":"Broker to Broker",
"show":"Broker to Broker",
"goal":"Get More Business",
"topic":"AIME Community",
"g":[
"#0b1f5b",
"#20adce"
],
"access":[
"All Members"
],
"body":[
"🎙 Episode 251",
"Host: Marc Summers (AIME's Founding President)",
"Guest: Ryan Whitfield (Home Loan Specialist at C2 Financial)",
"This week's episode features Ryan Whitfield, who spent a decade as a pastor before transitioning into the mortgage industry. Ryan shares how his background in building trust and connecting with people became the foundation of his lending business.",
"From struggling with internet leads to building a referral based model around first time home-buyers, Ryan offers a refreshing perspective on partnership, family, and finding your true value add.",
"🔹 Key Takeaways"
],
"points":[],
"img":"assets/content/resources/broker-to-broker-podcast-episode-251.jpg"
},
{
"title":"Broker Power-Up Podcast: Episode 65",
"type":"Podcast",
"cta":"Listen now",
"dur":"Jun 22, 2026",
"pub":"2026-06-22",
"sub":"feat. Jonathon Haddad & Tommy Golightly",
"series":"Broker Power-Up",
"show":"Broker Power-Up",
"goal":"Get More Business",
"topic":"Marketing & Personal Brand",
"g":[
"#1b1b3a",
"#7a3fb0"
],
"access":[
"All Members"
],
"body":[
"🎙 Episode 65: Leading the Conversation with Confidence",
"Hosted by Jonathon Haddad, AIME's Chairman & CEO, alongside Tommy Golightly, AIME's Marketing Manager.",
"In this episode, Jonathon and Tommy share practical strategies for taking control of sales conversations without being aggressive or rude. Drawing from lessons learned in his grandmother's home, Jonathon explains how to be direct, kind, and effective all at once.",
"🔥 Broker Buzz",
"Whether a property inspection report can be transferred like an appraisal, and what happens when Freddie Mac's AUS findings change.",
"How to handle a borrower with past financial crime convictions, including when to call the lender directly and when to walk away."
],
"points":[],
"img":"assets/content/resources/broker-power-up-podcast-episode-65.jpg"
},
{
"title":"Mortgage Mornings | June 17th, 2026",
"type":"Podcast",
"cta":"Listen now",
"dur":"Jun 17, 2026",
"pub":"2026-06-17",
"sub":"feat. Jason Frazier & Jonathon Haddad",
"series":"Mortgage Mornings",
"show":"Mortgage Mornings",
"goal":"Close More Loans",
"topic":"Loan Products & Guidelines",
"g":[
"#0b2a5b",
"#e0463c"
],
"access":[
"All Members"
],
"body":[
"This week's episode of Mortgage Mornings focused on managing business partnerships and having difficult but necessary conversations with under-performing clients, agents, and team members.",
"Jonathon introduced a four-step framework for respectfully disassociating from unproductive partners, emphasizing clear communication, emotional regulation, and setting firm boundaries.",
"These decisions have a long term impact on business growth and ghosting is never the answer, especially when clients are making the biggest financial decision of their lives.",
"The group discussed whether to fire under-performing but \"nice\" team members, with Jonathon sharing his experience of giving someone 18 months to improve while focusing resources on top performers."
],
"points":[],
"img":"assets/content/resources/mortgage-mornings-june-17th-2026.jpg"
},
{
"title":"The 'Daily Six' Challenge (Part 2)",
"type":"Training",
"cta":"Watch now",
"dur":"Jun 15, 2026",
"pub":"2026-06-15",
"sub":"AIME Accelerate",
"series":"Accelerate",
"show":"AIME Accelerate",
"goal":"Mindset & Habits",
"topic":"Mindset & Habits",
"g":[
"#5b2a86",
"#dd1969"
],
"access":[
"All Members"
],
"body":[
"No more reactive firefighting. No more mistaking routine tasks for real growth. Just a dead-simple filter for what actually moves your business forward.",
"What You'll Walk Away With",
"A three-filter test to separate critical growth tasks from daily noise.",
"A \"win before noon\" framework for protecting your best hours.",
"A practical system for doing less of what feels urgent and more of what actually works."
],
"points":[],
"img":"assets/content/resources/the-daily-six-challenge-part-2.jpg"
},
{
"title":"Women's Mortgage Network Podcast: Episode 24",
"type":"Podcast",
"cta":"Listen now",
"dur":"Jun 12, 2026",
"pub":"2026-06-12",
"sub":"feat. Julie Yarbrough & Elizabeth Cassidy",
"series":"WMN",
"show":"Women's Mortgage Network",
"goal":"Get More Business",
"topic":"Leads & Referral Partners",
"g":[
"#86145a",
"#dd1969"
],
"access":[
"All Members"
],
"body":[
"In this episode, Julie Yarbrough sits down with Elizabeth Cassidy, an Air Force veteran, military spouse, and mother of four who also happens to be one of the most outspoken and successful VA loan officers in the country.",
"Elizabeth shares what it really means to fight for veteran families, from the moment a listing agent told her an amputee from Afghanistan didn't have \"enough skin in the game\" to the cease and desist letters she's turned into paper airplanes.",
"She also talks about balancing a two hundred unit per year business with cooking dinner every night, cheering on her competitive cheerleader daughter, and why she stopped caring what other people think of her \"unprofessional\" opinions.",
"If you have ever been told to tone it down or wondered how to build a business without dimming your light, this conversation is for you.",
"🔔 Subscribe to our channel and join the movement!",
"🎧 Listen wherever you get your podcasts."
],
"points":[],
"img":"assets/content/resources/women-s-mortgage-network-podcast-episode-24.jpg"
},
{
"title":"Broker to Broker Podcast: Episode 250",
"type":"Podcast",
"cta":"Listen now",
"dur":"Jun 12, 2026",
"pub":"2026-06-12",
"sub":"feat. Tanner Mulvihill",
"series":"Broker to Broker",
"show":"Broker to Broker",
"goal":"Get More Business",
"topic":"AIME Community",
"g":[
"#0b1f5b",
"#20adce"
],
"access":[
"All Members"
],
"body":[
"🎙 Episode 250",
"Host: Marc Summers (AIME's Founding President)",
"Guest: Tanner Mulvihill (Owner and Senior Loan Officer of Bayfield Home Loans)",
"This week's milestone 250th episode features Tanner Mulvihill, a former United States Marine turned mortgage broker who has spent over two decades perfecting the art of the bold move.",
"Tanner shares his three stage blueprint for loan officers: how to survive and thrive as a new LO, how to lock in systems and past client relationships in the middle years, and how a bold relocation can breathe new life into a veteran's career.",
"🔹 Key Takeaways"
],
"points":[],
"img":"assets/content/resources/broker-to-broker-podcast-episode-250.jpg"
},
{
"title":"Broker Power-Up Podcast: Episode 64",
"type":"Podcast",
"cta":"Listen now",
"dur":"Jun 12, 2026",
"pub":"2026-06-12",
"sub":"feat. Jonathon Haddad & Tommy Golightly",
"series":"Broker Power-Up",
"show":"Broker Power-Up",
"goal":"Get More Business",
"topic":"Marketing & Personal Brand",
"g":[
"#1b1b3a",
"#7a3fb0"
],
"access":[
"All Members"
],
"body":[
"🎙 Episode 64: How & When to Fire Your Real Estate Agent",
"Hosted by Jonathon Haddad, AIME's Chairman & CEO, alongside Tommy Golightly, AIME's Marketing Manager.",
"In this episode, Jonathon and Tommy discuss a difficult but necessary skill for any loan officer: knowing when a partnership is doing more harm than good and how to end it professionally.",
"🔥 Broker Buzz",
"The latest AI compliance guidance from Fannie Mae, including the eight things every broker must do regarding governance, documentation, accountability, and oversight. .",
"Financing options for a borrower with a 600 FICO, who needs cash out of an investment property for repairs."
],
"points":[],
"img":"assets/content/resources/broker-power-up-podcast-episode-64.jpg"
},
{
"title":"Mortgage Mornings | June 10th, 2026",
"type":"Podcast",
"cta":"Listen now",
"dur":"Jun 10, 2026",
"pub":"2026-06-10",
"sub":"feat. Jason Frazier & Jonathon Haddad",
"series":"Mortgage Mornings",
"show":"Mortgage Mornings",
"goal":"Close More Loans",
"topic":"Loan Products & Guidelines",
"g":[
"#0b2a5b",
"#e0463c"
],
"access":[
"All Members"
],
"body":[
"This week's episode of Mortgage Mornings focused on how to win the day through systematic activity tracking and leading indicators rather than lagging outcomes.",
"Kym shared her personal journey from making $23,000 in her first year as a loan officer to achieving six figures, explaining how she developed a scorecard system for daily activities. She detailed her five day work structure, including a dedicated Friday for planning, and broke down her 7:1 conversion rate from conversations to referrals.",
"The group discussed handling unexpected issues, managing energy levels, pop by gifts for clients and realtors, and the importance of having clear purpose behind income goals.",
"The meeting wrapped up with Kym encouraging loan officers to stay calm under pressure, build strong accountability systems, and focus on what they can control every single day."
],
"points":[],
"img":"assets/content/resources/mortgage-mornings-june-10th-2026.jpg"
},
{
"title":"AI-Powered Retention and Growth Tech",
"type":"Webinar",
"cta":"Watch now",
"dur":"Jun 9, 2026",
"pub":"2026-06-09",
"sub":"feat. Tawd Frensley & Bryce Williams",
"series":"Webinar",
"show":"",
"goal":"Run & Grow Your Business",
"topic":"AI & Technology",
"g":[
"#0b1f5b",
"#1893b1"
],
"access":[
"Elite",
"VIP"
],
"body":[
"Jonathon Haddad sits down with Tawd Frensley and Bryce Williams to talk about what growth means in the mortgage world and gets to share tactics from industry veterans about staying in front of your past clients.",
"Tawd highlights the importance of retention, visibility and solving problems before they come knocking. They also demonstrate the power of their platforms new features and how they can open up the floodgates for new opportunities.",
"If you're looking for ways to elevate your operation and stay visible longer, this is an episode you won't want to miss!"
],
"points":[],
"img":"assets/content/resources/ai-powered-retention-and-growth-tech.jpg"
},
{
"title":"The 'Daily Six' Challenge",
"type":"Training",
"cta":"Watch now",
"dur":"Jun 8, 2026",
"pub":"2026-06-08",
"sub":"AIME Accelerate",
"series":"Accelerate",
"show":"AIME Accelerate",
"goal":"Mindset & Habits",
"topic":"Mindset & Habits",
"g":[
"#5b2a86",
"#dd1969"
],
"access":[
"All Members"
],
"body":[
"No identity talk without action. No goals without a tracker. Just six daily habits that actually move the needle on health, business, and focus.",
"What You'll Walk Away With",
"A non-negotiable daily six-habit framework (sleep, water, move, fuel, feed, win).",
"A personal commitment card and streak-based tracker.",
"A 23-day system for becoming the version of yourself who doesn't need motivation."
],
"points":[],
"img":"assets/content/resources/the-daily-six-challenge.jpg"
},
{
"title":"Broker Power-Up Podcast: Episode 63",
"type":"Podcast",
"cta":"Listen now",
"dur":"Jun 5, 2026",
"pub":"2026-06-05",
"sub":"feat. Jonathon Haddad & Tommy Golightly",
"series":"Broker Power-Up",
"show":"Broker Power-Up",
"goal":"Get More Business",
"topic":"Marketing & Personal Brand",
"g":[
"#1b1b3a",
"#7a3fb0"
],
"access":[
"All Members"
],
"body":[
"🎙 Episode 63: Proactive vs. Reactive Sales",
"Hosted by Jonathon Haddad, AIME's Chairman & CEO, alongside Tommy Golightly, AIME's Marketing Manager.",
"In this episode, Jonathon and Tommy explore the fundamental difference between loan officers who consistently close deals and those who watch opportunities slip away. The gap is not talent or luck. It is preparation.",
"🔥 Broker Buzz",
"Whether a husband who is a realtor can use his three percent commission as a gift for his wife's cash to close, and what documentation is required.",
"How to handle income from a salaried attorney who just became a law firm partner and now receives K-1 distributions instead of a W-2."
],
"points":[],
"img":"assets/content/resources/broker-power-up-podcast-episode-63.jpg"
},
{
"title":"Mortgage Mornings | June 3rd, 2026",
"type":"Podcast",
"cta":"Listen now",
"dur":"Jun 3, 2026",
"pub":"2026-06-03",
"sub":"feat. Jason Frazier & Jonathon Haddad",
"series":"Mortgage Mornings",
"show":"Mortgage Mornings",
"goal":"Close More Loans",
"topic":"Loan Products & Guidelines",
"g":[
"#0b2a5b",
"#e0463c"
],
"access":[
"All Members"
],
"body":[
"This week's episode of Mortgage Mornings focused on building structured systems to move from reactive chaos to consistent success in the mortgage industry.",
"Wade Betz shared his 20 year journey from retail to broker correspondent and outlined his roadmap for loan officers. He emphasized focusing on controllable factors like attitude and effort, and shared that 65% of his business now comes from past clients through a structured retention system.",
"The group discussed the four Ds of delegation (do, delegate, defer, and delete), the benefits of third party processors, and how to scale a branch from zero to $224 million annually without burning out.",
"The meeting wrapped up with Wade encouraging loan officers to track their sales activities daily and to build a team around them so they can focus on what actually drives revenue."
],
"points":[],
"img":"assets/content/resources/mortgage-mornings-june-3rd-2026.jpg"
},
{
"title":"Women's Mortgage Network Podcast: Episode 23",
"type":"Podcast",
"cta":"Listen now",
"dur":"May 29, 2026",
"pub":"2026-05-29",
"sub":"feat. Melissa Rifai & Jade Taylor",
"series":"WMN",
"show":"Women's Mortgage Network",
"goal":"Get More Business",
"topic":"Leads & Referral Partners",
"g":[
"#86145a",
"#dd1969"
],
"access":[
"All Members"
],
"body":[
"What if your superpower wasn't just closing loans, but helping people truly understand what they're signing for the first time?",
"In this episode, Melissa Rifai sits down with Jade Taylor, broker owner of her own mortgage company, for a beautiful conversation about serving the Brazilian community and building a business around connection, not just transactions.",
"She opens up about the early days when she almost gave up after six months without a single contract, how her husband pushed her to keep going, and what it felt like when that first deal finally came through.",
"Jade also talks about the unique challenges of working with Portuguese speaking clients, from hour long phone calls to recording Loom videos to help them understand every document, and why she wouldn't trade it for anything.",
"If you have ever considered niching down into a community that needs you, or just need a reminder that persistence pays off, this episode will inspire you.",
"🔔 Subscribe to our channel and join the movement!"
],
"points":[],
"img":"assets/content/resources/women-s-mortgage-network-podcast-episode-23.jpg"
},
{
"title":"Broker Power-Up Podcast: Episode 62",
"type":"Podcast",
"cta":"Listen now",
"dur":"May 29, 2026",
"pub":"2026-05-29",
"sub":"feat. Jason Taormina",
"series":"Broker Power-Up",
"show":"Broker Power-Up",
"goal":"Get More Business",
"topic":"Marketing & Personal Brand",
"g":[
"#1b1b3a",
"#7a3fb0"
],
"access":[
"All Members"
],
"body":[
"🎙 Episode 62: Building Relationships That Last with Jason Taormina",
"Hosted by Jonathon Haddad, AIME's Chairman & CEO, and Tommy Golightly, AIME's Marketing Manager, featuring special guest Jason Taormina of AutoPayPlus.",
"In this episode, Jonathon and Tommy are joined by Jason Taormina to discuss what it really means to run a relationship based business in an industry that constantly pushes you toward the next deal. Jason shares how loan officers can stay connected with borrowers after closing, help them pay down debt faster, and position themselves as the trusted financial concierge for life.",
"🔥 Broker Buzz",
"Whether appraisals are coming in low more often, and how Fannie Mae's risk assessment system is changing the game.",
"How to help a borrower verify an IRS payment plan when the agency says they cannot reissue the letter. (Spoiler: they can.)"
],
"points":[],
"img":"assets/content/resources/broker-power-up-podcast-episode-62.jpg"
},
{
"title":"You Don't Need A Lower Rate to Save Thousands On Your Mortgage",
"type":"Webinar",
"cta":"Watch now",
"dur":"May 28, 2026",
"pub":"2026-05-28",
"sub":"feat. Jason Taormina",
"series":"Webinar",
"show":"",
"goal":"Close More Loans",
"topic":"Loan Products & Guidelines",
"g":[
"#0b1f5b",
"#1893b1"
],
"access":[
"All Members"
],
"body":[
"Jonathon Haddad sits down with Jason Taormina, Senior Director of Mortgage & Insurance at AutoPayPlus, to explore a simple but powerful question",
"\"What if you could save thousands on your mortgage without changing your interest rate?\"",
"Jason explains how most homeowners are leaving money on the table by not aligning their mortgage payments with their paycheck schedule. He breaks down how a biweekly payment strategy can generate an extra principal payment each year, build equity faster, and potentially shave years off a loan—all without a refinance.",
"Beyond the math, Jason shares how AutoPayPlus helps loan officers stay in front of past clients through automated, non salesy touchpoints that keep you top of mind. He also walks through the revenue sharing program that turns client enrollment into recurring residual income.",
"If you want to offer your clients a smarter repayment strategy and build a book of business that works for you long after closing, this webinar is for you."
],
"points":[],
"img":"assets/content/resources/you-don-t-need-a-lower-rate-to-save-thousands-on-your-mortga.jpg"
},
{
"title":"Mortgage Mornings | May 27th, 2026",
"type":"Podcast",
"cta":"Listen now",
"dur":"May 27, 2026",
"pub":"2026-05-27",
"sub":"feat. Jason Frazier & Jonathon Haddad",
"series":"Mortgage Mornings",
"show":"Mortgage Mornings",
"goal":"Close More Loans",
"topic":"Loan Products & Guidelines",
"g":[
"#0b2a5b",
"#e0463c"
],
"access":[
"All Members"
],
"body":[
"This week's episode of Mortgage Mornings focused on health, identity, and building sustainable habits for loan officers who often put work ahead of everything else.",
"Anthony Casa shared his inspirational transformation journey, where he gave up alcohol and Adderall after twenty years and explained his system of adding one quarterly core habit at a time.",
"The group discusses how to find balance between being a 'workaholic' and prioritizing yourself. Whether it's prioritizing nutrition, exercise, or your sleeping habits, small habits and consistent effort are the keys to success.",
"The meeting wraps up with encouragement to add just one new habit and to see where it can take you."
],
"points":[],
"img":"assets/content/resources/mortgage-mornings-may-27th-2026.jpg"
},
{
"title":"Surviving the AI Shift in Google & YouTube",
"type":"Training",
"cta":"Watch now",
"dur":"May 26, 2026",
"pub":"2026-05-26",
"sub":"AIME Accelerate",
"series":"Accelerate",
"show":"AIME Accelerate",
"goal":"Mindset & Habits",
"topic":"Mindset & Habits",
"g":[
"#5b2a86",
"#dd1969"
],
"access":[
"All Members"
],
"body":[
"A 60-Minute A.I. Search deep dive for Loan Officers who want to be the answer, not just another option.",
"No fluff. No recycled tactics. Just how Google and YouTube actually find, extract, and serve content right now.",
"What You'll Walk Away With",
"A scenario-based content framework that gets found (not generic keywords).",
"A 90-second video structure designed for AI extraction.",
"A local credibility system using Google Business Profiles and client reviews that actually convert."
],
"points":[],
"img":"assets/content/resources/surviving-the-ai-shift-in-google-youtube.jpg"
},
{
"title":"Broker Power-Up Podcast: Episode 61",
"type":"Podcast",
"cta":"Listen now",
"dur":"May 22, 2026",
"pub":"2026-05-22",
"sub":"feat. Jonathon Haddad & Tommy Golightly",
"series":"Broker Power-Up",
"show":"Broker Power-Up",
"goal":"Get More Business",
"topic":"Marketing & Personal Brand",
"g":[
"#1b1b3a",
"#7a3fb0"
],
"access":[
"All Members"
],
"body":[
"🎙 Episode 61: Certainty Over Information",
"Hosted by Jonathon Haddad, AIME's Chairman & CEO, and Tommy Golightly, AIME's Marketing Manager.",
"In this episode, Jonathon and Tommy discuss the fundamental shift in how consumers approach major financial decisions. With five hundred million weekly users on ChatGPT and nearly half a billion on Reddit, your clients are already researching before they call. The question is no longer about whether they have information or not. The new question is whether you can give them something that A.I. cannot.",
"🔥 Broker Buzz",
"Practical strategies for generating refinance business when rates are unfavorable.",
"Whether a seller can raise the purchase price after an appraisal comes in high, and why the buyer's agreement is only the first step."
],
"points":[],
"img":"assets/content/resources/broker-power-up-podcast-episode-61.jpg"
},
{
"title":"Mortgage Mornings | May 20th, 2026",
"type":"Podcast",
"cta":"Listen now",
"dur":"May 20, 2026",
"pub":"2026-05-20",
"sub":"feat. Jason Frazier & Jonathon Haddad",
"series":"Mortgage Mornings",
"show":"Mortgage Mornings",
"goal":"Close More Loans",
"topic":"Loan Products & Guidelines",
"g":[
"#0b2a5b",
"#e0463c"
],
"access":[
"All Members"
],
"body":[
"The meeting focused on work life balance, time blocking, and redefining what productivity actually looks like for loan officers.",
"Wade Betz shared his detailed weekly schedule, showing how he structures his days around effectiveness rather than just being busy. Kym Mason introduced the concept of managing energy instead of managing time, and the group discussed the very real \"work guilt\" that many loan officers feel when they step away.",
"Jonathon walked through his daily journaling practice, which includes two wins from the day before, two must do tasks, and checking in on Maslow's hierarchy of needs.",
"The meeting ended with Frazier encouraging attendees to stop looking for easy and start looking for effective. He shared a time tracking sheet and recommended auditing your days before trying to block your calendar."
],
"points":[],
"img":"assets/content/resources/mortgage-mornings-may-20th-2026.jpg"
},
{
"title":"What If Your Income Stopped Tomorrow?",
"type":"Webinar",
"cta":"Watch now",
"dur":"May 20, 2026",
"pub":"2026-05-20",
"sub":"feat. Celeste Sierra & Manuel Soto",
"series":"Webinar",
"show":"",
"goal":"Mindset & Habits",
"topic":"Mindset & Habits",
"g":[
"#0b1f5b",
"#1893b1"
],
"access":[
"Elite",
"VIP"
],
"body":[
"Jonathon Haddad sits down with Celeste Sierra, Mortgage Broker at Your Mortgage Geeks, and Manuel Soto, CEO & Founder of The Financial Architects, to explore an uncomfortable question",
"\"What happens if you suddenly can't work?\"",
"Celeste graciously shares her own journey after being diagnosed with stage three breast cancer earlier this year and opens up about how the policies she set up through The Financial Architects allowed her to access living benefits that now fund her treatment and replace her lost income.",
"Manuel breaks down the difference between old insurance policies and modern ones with living benefits that cover cancer, heart attack, and stroke. He also explains why most loan officers are under-protected and how to fix it. If you want to protect your family and your income, or learn how to become a better connector for your clients, this webinar is for you."
],
"points":[],
"img":"assets/content/resources/what-if-your-income-stopped-tomorrow.jpg"
},
{
"title":"Women's Mortgage Network Podcast: Episode 22",
"type":"Podcast",
"cta":"Listen now",
"dur":"May 15, 2026",
"pub":"2026-05-15",
"sub":"feat. Amy Hulett & Ashlin Endter",
"series":"WMN",
"show":"Women's Mortgage Network",
"goal":"Get More Business",
"topic":"Leads & Referral Partners",
"g":[
"#86145a",
"#dd1969"
],
"access":[
"All Members"
],
"body":[
"What if the hardest part of running your own brokerage wasn't the loans, the systems, or the compliance, but learning to say no?",
"In this episode, Amy Hulett sits down with Ashlin Endter, broker owner and CEO of 4MG Mortgage LLC, for a raw and real conversation about building a business from the ground up.",
"Ashlin gets real about her journey from single mom to running a multi-state brokerage and gets honest about the confidence that drove her to open her own shop, the hard lessons she learned along the way, and why \"no\" is now her favorite word.",
"They dive into the reality of broker ownership, the hidden costs nobody warns you about, and why work-life balance might not exist, but work-life harmony does.",
"If you have ever wondered what it really takes to run your own brokerage, or just need permission to protect your time and your peace, this one is for you.",
"🔔 Subscribe to our channel and join the movement!"
],
"points":[],
"img":"assets/content/resources/women-s-mortgage-network-podcast-episode-22.jpg"
},
{
"title":"Broker to Broker Podcast: Episode 249",
"type":"Podcast",
"cta":"Listen now",
"dur":"May 15, 2026",
"pub":"2026-05-15",
"sub":"feat. Mario Escobedo",
"series":"Broker to Broker",
"show":"Broker to Broker",
"goal":"Get More Business",
"topic":"AIME Community",
"g":[
"#0b1f5b",
"#20adce"
],
"access":[
"All Members"
],
"body":[
"🎙 Episode 249",
"Host: Marc Summers (AIME's Founding President)",
"Guest: Mario Escobedo (Owner and Founder of Sienna Mortgage)",
"Mario Escobedo grew up around the mortgage industry, stepped away from it, and ultimately came back to build something all his own. He shares how his early years as a loan coordinator shaped his understanding of the business, why he treats every client interaction like a system, and how giving value without asking has become the cornerstone of his success with realtor partners.",
"🔹 Key Takeaways",
"Why \"partner\" is the most important word in his vocabulary and how he reinforces it."
],
"points":[],
"img":"assets/content/resources/broker-to-broker-podcast-episode-249.jpg"
},
{
"title":"Broker Power-Up Podcast: Episode 60",
"type":"Podcast",
"cta":"Listen now",
"dur":"May 15, 2026",
"pub":"2026-05-15",
"sub":"feat. Jonathon Haddad & Tommy Golightly",
"series":"Broker Power-Up",
"show":"Broker Power-Up",
"goal":"Get More Business",
"topic":"Marketing & Personal Brand",
"g":[
"#1b1b3a",
"#7a3fb0"
],
"access":[
"All Members"
],
"body":[
"🎙 Episode 60: Cash Out Refinances, Reciprocity, and Never Showing Up Empty Handed",
"Hosted by Jonathon Haddad, AIME's Chairman & CEO, and Tommy Golightly, AIME's Marketing Manager.",
"Episode 60 is here and in this milestone episode, Jonathon and Tommy reflect on consistency, community, and the strategies that separate top producers from everyone else.",
"Jonathon shares six actionable steps for winning more cash out refinances and explains a psychological principle that has guided his entire career.",
"🔥 Broker Buzz",
"When to decline a down payment assistance request from clients who appear to have hidden assets, and why protecting your license matters more than one loan."
],
"points":[],
"img":"assets/content/resources/broker-power-up-podcast-episode-60.jpg"
},
{
"title":"Daily Discipline: What Top LOs ACTUALLY Do",
"type":"Webinar",
"cta":"Watch now",
"dur":"May 12, 2026",
"pub":"2026-05-12",
"sub":"feat. Michael Radcliffe",
"series":"Webinar",
"show":"",
"goal":"Mindset & Habits",
"topic":"Mindset & Habits",
"g":[
"#0b1f5b",
"#1893b1"
],
"access":[
"Elite",
"VIP"
],
"body":[
"Use coupon code: J8BFBAJJ to reduce the onboarding fee from $250 down to just $99!",
"AIME gets the opportunity to sit down with Michael Radcliffe, Founder of RAD CRM, to talk about the one thing that separates top producers from everyone else: staying in the green zone.",
"Michael shares how he built RAD by starting with his own problems as a loan officer, then adding features based on real feedback from top producers and everyday LO's.",
"You'll see live demos of pre-built automations that handle follow-up cadences, milestone updates, birthday reminders, and even Google review requests at CTC.",
"If you've ever bought a CRM and let it sit unused, or if you're not sure where to start, this demo will show you how to make your CRM feel less like a chore and more like breathing."
],
"points":[],
"img":"assets/content/resources/daily-discipline-what-top-los-actually-do.jpg"
},
{
"title":"Women's Mortgage Network Podcast: Episode 21",
"type":"Podcast",
"cta":"Listen now",
"dur":"May 8, 2026",
"pub":"2026-05-08",
"sub":"feat. Christine Beckwith & Sparkle Swann Middlebrook",
"series":"WMN",
"show":"Women's Mortgage Network",
"goal":"Get More Business",
"topic":"Leads & Referral Partners",
"g":[
"#86145a",
"#dd1969"
],
"access":[
"All Members"
],
"body":[
"In this episode, Christine Beckwith sits down with Sparkle Swann Middlebrook, a newer loan officer who walked into her very first industry event knowing absolutely no one. She traveled through a hurricane, slept in her car, and showed up anyway.",
"That decision changed everything.",
"Sparkle gets real about the intimidation of being new, the power of sitting at the right table, and how being welcomed into Women's Mortgage Network gave her the confidence to keep going.",
"Christine shares her own story of walking into a room full of strangers and why she now makes it a point to find the person standing alone.",
"Together, they dive into why community builds confidence, not the other way around, and how the broker space is the perfect place for women who want to grow at their own pace, on their own terms.",
"If you have ever felt like you don't belong in the room, this conversation is your permission slip to walk in anyway."
],
"points":[],
"img":"assets/content/resources/women-s-mortgage-network-podcast-episode-21.jpg"
},
{
"title":"Broker to Broker Podcast: Episode 248",
"type":"Podcast",
"cta":"Listen now",
"dur":"May 8, 2026",
"pub":"2026-05-08",
"sub":"feat. JP Hussey",
"series":"Broker to Broker",
"show":"Broker to Broker",
"goal":"Get More Business",
"topic":"AIME Community",
"g":[
"#0b1f5b",
"#20adce"
],
"access":[
"All Members"
],
"body":[
"🎙 Episode 248",
"Host: Marc Summers (AIME's Founding President)",
"Guest: JP Hussey (The Hussey Team)",
"JP Hussey is back, and he brought the Huss-bus.",
"Our former Broker to Broker host returns to talk marketing, mindset, and how to make mortgages fun. From the famous Huss-bus to closing loans on the Rocky steps in Philly, JP has built a purchase-focused brokerage around consistency, fun, and genuine relationships. He sits down with Marc to talk about marketing, mindset, and why scheduling your day is the secret to keeping your sanity.",
"🔹 Key Takeaways"
],
"points":[],
"img":"assets/content/resources/broker-to-broker-podcast-episode-248.jpg"
},
{
"title":"Automated Income Calculation & Smart Conditions",
"type":"Webinar",
"cta":"Watch now",
"dur":"May 7, 2026",
"pub":"2026-05-07",
"sub":"feat. Alex Zhyzhko, Stacy Francis and Jonathon Haddad",
"series":"Webinar",
"show":"",
"goal":"Run & Grow Your Business",
"topic":"AI & Technology",
"g":[
"#0b1f5b",
"#1893b1"
],
"access":[
"All Members"
],
"body":[
"In this webinar, our team sits down with Alex Zhyzhko and Stacy Francis",
"from Rapidio to show you how to eliminate the biggest headache in mortgage lending: complex income calculations.",
"They walk through a live demo of their platform, which combines cutting-edge AI with a live underwriting team. You'll see exactly how they automate income calculations for self-employed borrowers, variable wage earners, and even tricky bank statement programs; turning what used to take hours into a process that delivers results in as little as 10 minutes.",
"Throughout the video, our guests demonstrate how the system flags red flags like declining income, missing documents, or altered statements before you ever submit to a lender. They also cover their affordable pricing, SOC 2 security compliance, and how their live QC team steps in to handle those gray-area scenarios that AI alone can't solve.",
"If you're ready to stop worrying about tax returns and start hunting your next client, this demo is for you."
],
"points":[],
"img":"assets/content/resources/automated-income-calculation-smart-conditions.jpg"
},
{
"title":"Women's Mortgage Network Podcast: Episode 20",
"type":"Podcast",
"cta":"Listen now",
"dur":"Apr 24, 2026",
"pub":"2026-04-24",
"sub":"feat. Nike T. Ojo & Meredith Herr",
"series":"WMN",
"show":"Women's Mortgage Network",
"goal":"Get More Business",
"topic":"Leads & Referral Partners",
"g":[
"#86145a",
"#dd1969"
],
"access":[
"All Members"
],
"body":[
"What if you stopped chasing a hundred loans a month and started focusing on the two families you could truly help instead?",
"In this episode, Nike T. Ojo sits down with Meredith Herr, co-owner of Lake Tahoe Mortgage, for a warm and honest conversation about building a mortgage business that fits your life, not the other way around.",
"Meredith shares how she went from IPO consulting to working alongside her dad, why she calls herself a \"mortgage coach,\" and how she helps first-time homebuyers get prepared long before they ever step foot in a house.",
"They dive into the misconceptions that trip buyers up, the power of starting the conversation early, and why the broker space is the perfect place for women who want flexibility, especially those raising young kids.",
"Meredith also opens up about finding her people in WMN and why having a community of women cheering you on is absolutely irreplaceable.",
"This episode is a reminder that you don't have to be a top-tier producer. You just have to show up, help families, and build a business that works for you."
],
"points":[],
"img":"assets/content/resources/women-s-mortgage-network-podcast-episode-20.jpg"
},
{
"title":"Broker to Broker Podcast: Episode 247",
"type":"Podcast",
"cta":"Listen now",
"dur":"Apr 24, 2026",
"pub":"2026-04-24",
"sub":"feat. Paul Messina",
"series":"Broker to Broker",
"show":"Broker to Broker",
"goal":"Get More Business",
"topic":"AIME Community",
"g":[
"#0b1f5b",
"#20adce"
],
"access":[
"All Members"
],
"body":[
"🎙 Episode 247",
"Host: Marc Summers (AIME's Founding President)",
"Guest: Paul Messina (VA Loan Specialist at Canopy Mortgage)",
"This week's episode features Paul Messina, a former paramedic, firefighter, police detective, and military veteran who found his way into the mortgage industry after a chance meeting with a loan officer who challenged him to \"do his effing job.\"",
"Paul shares his remarkable journey from healthcare and public safety to becoming a VA loan specialist, and how attending Ascent, AIME's VIP retreat in Puerto Rico, gave him a new perspective on purpose, legacy, and the importance of self awareness.",
"🔹 Key Takeaways"
],
"points":[],
"img":"assets/content/resources/broker-to-broker-podcast-episode-247.jpg"
},
{
"title":"Accelerate Sprint | Be Known: Build the Brand Called You",
"type":"Training",
"cta":"Watch now",
"dur":"Apr 24, 2026",
"pub":"2026-04-24",
"sub":"April: Session 1",
"series":"Accelerate",
"show":"AIME Accelerate",
"goal":"Mindset & Habits",
"topic":"Mindset & Habits",
"g":[
"#5b2a86",
"#dd1969"
],
"access":[
"All Members"
],
"body":[
"Be Known: Build the Brand Called You",
"A 2-Session Growth Sprint for Loan Officers and Mortgage Brokers who are doing everything right and still getting overlooked.",
"Two Sessions. Sixty Minutes Total.",
"Real frameworks. Real tactics. Zero B.S. Built for brokers ready to stop playing the commodity game and start being known.",
"What You'll Walk Away With",
"A clear, ownable professional identity."
],
"points":[],
"img":"assets/content/resources/accelerate-sprint-be-known-build-the-brand-called-you.jpg"
},
{
"title":"Accelerate Sprint | RISE: Referral Prospecting: The Deployment",
"type":"Training",
"cta":"Watch now",
"dur":"Apr 24, 2026",
"pub":"2026-04-24",
"sub":"March: Session 3",
"series":"Accelerate",
"show":"AIME Accelerate",
"goal":"Mindset & Habits",
"topic":"Mindset & Habits",
"g":[
"#5b2a86",
"#dd1969"
],
"access":[
"All Members"
],
"body":[
"Referrals, Introductions, Sales, Expansion",
"Session 3: The Deployment",
"Build Your Plan, Track What Works, and Actually Run It. By the end of this session, every participant leaves with a written personal strategy, five metrics to track, and a first-week action plan they are already committed to."
],
"points":[],
"img":"assets/content/resources/accelerate-sprint-rise-referral-prospecting-the-deployment.jpg"
},
{
"title":"Accelerate Sprint | RISE: Referral Prospecting: The System",
"type":"Training",
"cta":"Watch now",
"dur":"Apr 24, 2026",
"pub":"2026-04-24",
"sub":"March: Session 2",
"series":"Accelerate",
"show":"AIME Accelerate",
"goal":"Mindset & Habits",
"topic":"Mindset & Habits",
"g":[
"#5b2a86",
"#dd1969"
],
"access":[
"All Members"
],
"body":[
"Referrals, Introductions, Sales, Expansion",
"Session 2: The System",
"Session 1 changed how you think. Session 2 changes what you do. Knowing the why is not enough, you can believe in something completely and still not act on it. That is not a knowledge problem. That is a system problem. Today we build the system."
],
"points":[],
"img":"assets/content/resources/accelerate-sprint-rise-referral-prospecting-the-system.jpg"
},
{
"title":"Accelerate Sprint | RISE: Referral Prospecting: The Foundation",
"type":"Training",
"cta":"Watch now",
"dur":"Apr 24, 2026",
"pub":"2026-04-24",
"sub":"March: Session 1",
"series":"Accelerate",
"show":"AIME Accelerate",
"goal":"Mindset & Habits",
"topic":"Mindset & Habits",
"g":[
"#5b2a86",
"#dd1969"
],
"access":[
"All Members"
],
"body":[
"Referrals, Introductions, Sales, Expansion",
"Session 1: The Foundation",
"By the end of this session, you'll understand why referrals from your existing database are the highest-ROI activity you're not doing with intention and exactly what to do about it."
],
"points":[],
"img":"assets/content/resources/accelerate-sprint-rise-referral-prospecting-the-foundation.jpg"
},
{
"title":"The Indispensable LO",
"type":"Webinar",
"cta":"Watch now",
"dur":"Apr 21, 2026",
"pub":"2026-04-21",
"sub":"feat. Jessica Woodbeck",
"series":"Webinar",
"show":"",
"goal":"Run & Grow Your Business",
"topic":"Business Planning & Numbers",
"g":[
"#0b1f5b",
"#1893b1"
],
"access":[
"Elite",
"VIP"
],
"body":[
"In this webinar, Jonathon Haddad sits down with Jessica Woodbeck to break down what it actually takes to build meaningful referral partnerships in today’s market.",
"With over $1B in production, Jessica shares what separates the loan officers who stand out from the ones who get ignored, and how bringing real value, consistency, and process-driven execution is what earns long-term business."
],
"points":[],
"img":"assets/content/resources/the-indispensable-lo.jpg"
},
{
"title":"AIME Monthly Membership Call",
"type":"Webinar",
"cta":"Watch now",
"dur":"Apr 21, 2026",
"pub":"2026-04-21",
"sub":"April 2026",
"series":"Webinar",
"show":"",
"goal":"Run & Grow Your Business",
"topic":"Operations & Systems",
"g":[
"#0b1f5b",
"#1893b1"
],
"access":[
"All Members"
],
"body":[
"AIME leadership came together for an update call for our members, highlighting the momentum behind the community and what’s ahead. New and exciting announcements about a major giveaway during Fuse 2026, opportunities within the Accelerate program, re-launching key member committees and exclusive event perks."
],
"points":[],
"img":"assets/content/resources/aime-monthly-membership-call.jpg"
},
{
"title":"You Don't Need More Leads",
"type":"Webinar",
"cta":"Watch now",
"dur":"Apr 14, 2026",
"pub":"2026-04-14",
"sub":"How One Broker Used AI to Build Pipeline From What He Already Had",
"series":"Webinar",
"show":"",
"goal":"Get More Business",
"topic":"Leads & Referral Partners",
"g":[
"#0b1f5b",
"#1893b1"
],
"access":[
"Elite",
"VIP"
],
"body":[
"Jonathon Haddad is joined by Luke Shankula and broker-owner Zach Bleznick to break down what's actually working with AI for brokers right now. Zach had 90,000 contacts sitting in his database doing nothing. He thought he needed more leads. Turns out he didn't. They'll walk through what he did instead, how he rebuilt his brand online, and the AI tools that changed how he runs his business. Everyone on the call gets a free AI voice cloning system they can use that day."
],
"points":[],
"img":"assets/content/resources/you-don-t-need-more-leads.jpg"
},
{
"title":"Broker to Broker Podcast: Episode 246",
"type":"Podcast",
"cta":"Listen now",
"dur":"Mar 27, 2026",
"pub":"2026-03-27",
"sub":"feat. Kyle Koller",
"series":"Broker to Broker",
"show":"Broker to Broker",
"goal":"Get More Business",
"topic":"AIME Community",
"g":[
"#0b1f5b",
"#20adce"
],
"access":[
"All Members"
],
"body":[
"🎙 Episode 246",
"Host: Marc Summers (AIME's Founding President)",
"Guest: Kyle Koller (Branch Manager at UMortgage)",
"This week's episode features Kyle Koller, a ten year mortgage veteran who has built his entire career in the broker channel.",
"He shares his unconventional start in the industry, after receiving a text from a former student. Kyle talks with Marc about the mindset shifts, practical strategies, and relationship building tactics that have sustained his business through countless market cycles.",
"🔹 Key Takeaways"
],
"points":[],
"img":"assets/content/resources/broker-to-broker-podcast-episode-246.jpg"
},
{
"title":"Loan Officer Experience Podcast: Episode 19",
"type":"Podcast",
"cta":"Listen now",
"dur":"Mar 13, 2026",
"pub":"2026-03-13",
"sub":"feat. Austin Willis",
"series":"Loan Officer Experience",
"show":"Loan Officer Experience",
"goal":"Close More Loans",
"topic":"Sales & Conversations",
"g":[
"#7a1f55",
"#dd1969"
],
"access":[
"All Members"
],
"body":[
"In this episode of the Loan Officer Experience podcast, host Kenneth Travis sits down with Austin Willis, Account Executive at Kind Lending, to talk about the opportunities shaping the mortgage market in 2026.",
"Austin shares insights from more than two decades in wholesale lending, including the rapid growth of non-QM products, the impact of new down payment assistance programs, and why many originators are finding renewed momentum in the wholesale channel.",
"From AI and technology to building strong relationships with lender partners, this conversation highlights the strategies loan officers can use to stay proactive, competitive, and ready for the next phase of the market.",
"👉 Subscribe for more real talk with industry leaders.",
"🎧 Listen wherever you get your podcasts!",
"#KindLending #NonQM #Loans #BrokerGrowth #BrokersAreBest #LoanOfficerExperience #AIME #Podcast #Network"
],
"points":[],
"img":"assets/content/resources/loan-officer-experience-podcast-episode-19.jpg"
},
{
"title":"Past Client Sales System",
"type":"Document",
"cta":"Download",
"dur":"Jan 26, 2026",
"pub":"2026-01-26",
"sub":"Past Client Systems - Script Document",
"series":"Education",
"show":"",
"goal":"Get More Business",
"topic":"Leads & Referral Partners",
"g":[
"#1b7a4a",
"#2bb673"
],
"access":[
"All Members"
],
"body":[],
"points":[],
"img":"assets/content/resources/past-client-sales-system.jpg"
},
{
"title":"How We Compete With Retail, and Why Past Clients Still Win",
"type":"Document",
"cta":"Download",
"dur":"Jan 26, 2026",
"pub":"2026-01-26",
"sub":"Past Client Systems - Presentation File",
"series":"Education",
"show":"",
"goal":"Get More Business",
"topic":"Leads & Referral Partners",
"g":[
"#86145a",
"#dd1969"
],
"access":[
"All Members"
],
"body":[],
"points":[],
"img":"assets/content/resources/how-we-compete-with-retail-and-why-past-clients-still-win.jpg"
},
{
"title":"AIME To Serve - Episode 8",
"type":"Video",
"cta":"Watch now",
"dur":"Jan 16, 2026",
"pub":"2026-01-16",
"sub":"feat. Cheryl & Emmett Dempsey",
"series":"AIME To Serve",
"show":"AIME To Serve",
"goal":"Start Here",
"topic":"AIME Community",
"g":[
"#0b6b82",
"#20adce"
],
"access":[
"All Members"
],
"body":[
"Jonathon Haddad heads to sunny Florida to cook up a family recipe and an inspiring partnership with Cheryl & Emmett Dempsey.",
"In this episode, we dive into the unique dynamic of a power couple building separate but synergistic businesses within the mortgage space. Emmett shares his journey from the 2007 crash to becoming a consultative loan officer, while Cheryl reveals how she built a thriving third-party processing company from the ground up.",
"They open up about balancing entrepreneurship with family, leveraging video content and AI, and the intentional teamwork required to succeed on all fronts. Tune in for a heartfelt conversation about trauma, triumph, and the secret to making world-renowned fudge.",
"#AIMEToServe #BrokersAreBest #MortgagePodcast #PowerCouple #Entrepreneurship #LoanOfficer #MortgageProcessor #FamilyBusiness #AIME"
],
"points":[],
"img":"assets/content/resources/aime-to-serve-episode-8.jpg"
},
{
"title":"Loan Officer Experience Podcast: Episode 18",
"type":"Podcast",
"cta":"Listen now",
"dur":"Dec 19, 2025",
"pub":"2025-12-19",
"sub":"feat. Delfino Aguilar",
"series":"Loan Officer Experience",
"show":"Loan Officer Experience",
"goal":"Close More Loans",
"topic":"Sales & Conversations",
"g":[
"#0b1f5b",
"#163a85"
],
"access":[
"All Members"
],
"body":[
"In this episode of the Loan Officer Experience podcast, host Kenneth Travis has an in-depth conversation with Delfino Aguilar, Chief Production Officer at Kind Lending, where they discuss how correspondent lending can unlock new levels of control, flexibility, and growth for this generation of mortgage brokers.",
"Delfino clears up some of the most common misconceptions surrounding correspondent lending and explains how brokers of any size can leverage this channel to improve pricing, speed, and client experience.",
"From margin control to the role of technology and AI, this conversation offers a clear roadmap for brokers looking to expand their capabilities and stay competitive in a changing market.",
"👉 Subscribe for more real talk with industry leaders.",
"🎧 Listen wherever you get your podcasts!",
"#KindLending #CorrespondentLending #BrokerGrowth #BrokersAreBest #LoanOfficerExperience #AIME #Podcast #Network"
],
"points":[],
"img":"assets/content/resources/loan-officer-experience-podcast-episode-18.jpg"
},
{
"title":"Loan Officer Experience Podcast: Episode 17",
"type":"Podcast",
"cta":"Listen now",
"dur":"Dec 16, 2025",
"pub":"2025-12-16",
"sub":"feat. Jamie Miller",
"series":"Loan Officer Experience",
"show":"Loan Officer Experience",
"goal":"Close More Loans",
"topic":"Sales & Conversations",
"g":[
"#4a217a",
"#7a3fb0"
],
"access":[
"All Members"
],
"body":[
"In this episode of the Loan Officer Experience podcast, host Kenneth Travis sits down with Jamie Miller of Art of Conscious Communication to talk about mastering client communication.",
"Jamie breaks down the common mistakes that create friction, how to ask better questions, and why emotional connection wins where scripted talk fails. He also shares practical tips on building trust, handling objections, and using mindset to create predictable outcomes.",
"👉 Subscribe for more real talk with industry leaders. 🎧 Listen wherever you get your podcasts!",
"#LoanOfficerExperience #MortgagePodcast #LoanOfficers #JamieMiller #ArtofConsciousCommunication #BrokersAreBest #MortgageBrokers #ClientTrust #AIME #Podcast #Network"
],
"points":[],
"img":"assets/content/resources/loan-officer-experience-podcast-episode-17.jpg"
},
{
"title":"Dionne Bass | Breakout Speaker - Fuse 2025",
"type":"Video",
"cta":"Watch now",
"dur":"Dec 8, 2025",
"pub":"2025-12-08",
"sub":"Breakout Session @ Fuse 2025",
"series":"Fuse",
"show":"",
"goal":"Get More Business",
"topic":"AIME Community",
"g":[
"#0b2a5b",
"#1893b1"
],
"access":[
"All Members"
],
"body":[
"Tune in for Dionne Bass's Breakout Session at Fuse 2025 in Nashville, Tennessee!"
],
"points":[],
"img":"assets/content/resources/dionne-bass-breakout-speaker-fuse-2025.jpg"
},
{
"title":"John Wise | Breakout Speaker - Fuse 2025",
"type":"Video",
"cta":"Watch now",
"dur":"Dec 8, 2025",
"pub":"2025-12-08",
"sub":"Breakout Session @ Fuse 2025",
"series":"Fuse",
"show":"",
"goal":"Get More Business",
"topic":"AIME Community",
"g":[
"#7a1f1a",
"#e0463c"
],
"access":[
"All Members"
],
"body":[
"Tune in for John Wise's Breakout Session at Fuse 2025 in Nashville, Tennessee!"
],
"points":[],
"img":"assets/content/resources/john-wise-breakout-speaker-fuse-2025.jpg"
},
{
"title":"Mark Melini | Breakout Speaker - Fuse 2025",
"type":"Video",
"cta":"Watch now",
"dur":"Dec 8, 2025",
"pub":"2025-12-08",
"sub":"Breakout Session @ Fuse 2025",
"series":"Fuse",
"show":"",
"goal":"Get More Business",
"topic":"AIME Community",
"g":[
"#0f5e3f",
"#1b9d6b"
],
"access":[
"All Members"
],
"body":[
"Tune in for Mark Melini's Breakout Session at Fuse 2025 in Nashville, Tennessee!"
],
"points":[],
"img":"assets/content/resources/mark-melini-breakout-speaker-fuse-2025.jpg"
},
{
"title":"Maddie Kamphaus | Breakout Speaker - Fuse 2025",
"type":"Video",
"cta":"Watch now",
"dur":"Dec 8, 2025",
"pub":"2025-12-08",
"sub":"Breakout Session @ Fuse 2025",
"series":"Fuse",
"show":"",
"goal":"Get More Business",
"topic":"AIME Community",
"g":[
"#5b2a86",
"#a23fb0"
],
"access":[
"All Members"
],
"body":[
"Tune in for Maddie Kamphaus's Breakout Session at Fuse 2025 in Nashville, Tennessee!"
],
"points":[],
"img":"assets/content/resources/maddie-kamphaus-breakout-speaker-fuse-2025.jpg"
},
{
"title":"AIME To Serve - Episode 7",
"type":"Video",
"cta":"Watch now",
"dur":"Aug 22, 2025",
"pub":"2025-08-22",
"sub":"w/ Steph Christianson & Kim Clancy",
"series":"AIME To Serve",
"show":"AIME To Serve",
"goal":"Start Here",
"topic":"AIME Community",
"g":[
"#7a1f55",
"#dd1969"
],
"access":[
"All Members"
],
"body":[
"Jonathon Haddad sits down with two powerhouse Loan Officers, Steph Christianson and Kim Clancy, for a candid conversation on resilience, reinvention, and riding the waves of change. In this episode, Steph & Kim share how to not just survive, but shine through those industry cycles and explain why adaptability is the key to staying ahead. From Kim’s leap from education and psychology into lending, to Steph’s journey of balancing parenthood and a career at a young age, this episode is packed with hard-earned wisdom for anyone navigating the waves of this industry. Tune in to learn why the future belongs to those who prepare for it!"
],
"points":[],
"img":"assets/content/resources/aime-to-serve-episode-7.jpg"
},
{
"title":"This Isn’t Just Hype—TAG Is One Mortgage Event You Can’t Miss",
"type":"Video",
"cta":"Watch now",
"dur":"May 12, 2025",
"pub":"2025-05-12",
"sub":"This Isn’t Just Hype",
"series":"AIME Live",
"show":"",
"goal":"Close More Loans",
"topic":"Loan Products & Guidelines",
"g":[
"#1b7a4a",
"#2bb673"
],
"access":[
"All Members"
],
"body":[
"If you're in mortgage, real estate, or just want to be where the power moves are being made—this is your moment. Eddy Perez is going live to drop major insights on TAG, the event that’s set to flip the mortgage game on its head. We’re talking big names, next-level strategies, and a vision for the industry that nobody’s dared to say out loud… until now. This isn’t your typical promo—this is a behind-the-scenes look at what might become the most important event of your career. Tune in or miss out."
],
"points":[],
"img":"assets/content/resources/this-isn-t-just-hype-tag-is-one-mortgage-event-you-can-t-mis.jpg"
},
{
"title":"LO Performance Tracker Workbook",
"type":"Document",
"cta":"Download",
"dur":"Mar 25, 2025",
"pub":"2025-03-25",
"sub":"Downloadable Resource",
"series":"Education",
"show":"",
"goal":"Run & Grow Your Business",
"topic":"Business Planning & Numbers",
"g":[
"#86145a",
"#dd1969"
],
"access":[
"All Members"
],
"body":[],
"points":[],
"img":"assets/content/resources/lo-performance-tracker-workbook.jpg"
},
{
"title":"5 Scripts to Get to the \"Yes:",
"type":"Document",
"cta":"Download",
"dur":"Mar 25, 2025",
"pub":"2025-03-25",
"sub":"A Broker Outreach Printable",
"series":"Education",
"show":"",
"goal":"Close More Loans",
"topic":"Sales & Conversations",
"g":[
"#0b6b82",
"#20adce"
],
"access":[
"All Members"
],
"body":[],
"points":[],
"img":"assets/content/resources/5-scripts-to-get-to-the-yes.jpg"
},
{
"title":"20 Local Leads That Actually Convert",
"type":"Document",
"cta":"Download",
"dur":"Mar 25, 2025",
"pub":"2025-03-25",
"sub":"Printable Flyer",
"series":"Education",
"show":"",
"goal":"Get More Business",
"topic":"Leads & Referral Partners",
"g":[
"#0b1f5b",
"#163a85"
],
"access":[
"All Members"
],
"body":[],
"points":[],
"img":"assets/content/resources/20-local-leads-that-actually-convert.jpg"
},
{
"title":"CoreLogic: What's Your Success Story For 2025? - AIME LIVE",
"type":"Video",
"cta":"Watch now",
"dur":"Mar 25, 2025",
"pub":"2025-03-25",
"sub":"with Terri Davis, Kelly Guest, and Wade Betz",
"series":"AIME Live",
"show":"",
"goal":"Close More Loans",
"topic":"Loan Products & Guidelines",
"g":[
"#4a217a",
"#7a3fb0"
],
"access":[
"All Members"
],
"body":[
"Are you ready to make 2025 your most successful year yet? Join us for an exclusive webinar where we'll dive into the key marketing tactics, daily routines, and essential tools you need to drive more business and stay ahead of the competition. In this session, you'll learn how to: Increase your visibility in the market with effective marketing strategies. Implement best practices and routines to manage your day efficiently. Utilize the right tools to retain and grow your customer base. Whether you're worried about customer retention or looking to outshine your competitors, this webinar will provide you with the strategies you need to succeed. Plus, CoreLogic has an exclusive offer for AIME members that you won't want to miss! Don't miss out on this opportunity to equip yourself with the knowledge and tools to thrive in 2025. Register now and start crafting your success story! Takeaways: CoreLogic - Marketing & Retention Solutions for Brokers Find High-intent Borrowers, Close More Deals, Recruit Top Talent With CoreLogic’s Marketing & Retention Solutions for Brokers, you can supercharge your business with the best source of industry-leading data and market insights – delivering timely leads at your fingertips, helping you can close more business. Chatgpt Prompts Social Profile Optimization Guide Growth Only SAT 2025 Messaging for Results By Kelly Guest"
],
"points":[],
"img":"assets/content/resources/corelogic-what-s-your-success-story-for-2025-aime-live.jpg"
},
{
"title":"Marc Summers: Why You Should Be Hiring Now",
"type":"Video",
"cta":"Watch now",
"dur":"Dec 23, 2024",
"pub":"2024-12-23",
"sub":"Sales Rally",
"series":"Sales Rally",
"show":"",
"goal":"Run & Grow Your Business",
"topic":"Business Planning & Numbers",
"g":[
"#0b2a5b",
"#1893b1"
],
"access":[
"All Members"
],
"body":[
"Start the new week off right with a Sales Rally from AIME President Marc Summers. He is here to motivate you and tell you why now is the right time to begin growing your team for 2022."
],
"points":[],
"img":"assets/content/resources/marc-summers-why-you-should-be-hiring-now.jpg"
},
{
"title":"Sam Harris III: Developing More Minority Broker/Owners",
"type":"Video",
"cta":"Watch now",
"dur":"Dec 23, 2024",
"pub":"2024-12-23",
"sub":"Broker Playbook",
"series":"Broker Playbook",
"show":"",
"goal":"Run & Grow Your Business",
"topic":"Operations & Systems",
"g":[
"#7a1f1a",
"#e0463c"
],
"access":[
"All Members"
],
"body":[
"Listen in to Sam Harris III's important discussion about tangible ways to create more opportunities for minority Broker/Owners as well as Black homeownership."
],
"points":[],
"img":"assets/content/resources/sam-harris-iii-developing-more-minority-broker-owners.jpg"
},
{
"title":"Ryan Holiday: Keynote - Hall of AIME 2022",
"type":"Video",
"cta":"Watch now",
"dur":"Dec 23, 2024",
"pub":"2024-12-23",
"sub":"Hall of AIME 2022",
"series":"Hall of AIME",
"show":"",
"goal":"Mindset & Habits",
"topic":"Mindset & Habits",
"g":[
"#0f5e3f",
"#1b9d6b"
],
"access":[
"All Members"
],
"body":[
"Are you ready to answer your leadership calling? Learn the core lessons of fearless coaching from #1 NY Times bestselling author of Courage is Calling: Fortune Favors the Brave, Ryan Holiday. This thought-provoking keynote session will challenge your preconceived notions about how to guide your teams – and yourself – to meet your entrepreneurial destiny and catapult your business to the highest level of success."
],
"points":[],
"img":"assets/content/resources/ryan-holiday-keynote-hall-of-aime-2022.jpg"
},
{
"title":"Mat Ishbia: Keynote - Hall of AIME 2022",
"type":"Video",
"cta":"Watch now",
"dur":"Dec 23, 2024",
"pub":"2024-12-23",
"sub":"Hall of AIME 2022",
"series":"Hall of AIME",
"show":"",
"goal":"Mindset & Habits",
"topic":"Mindset & Habits",
"g":[
"#5b2a86",
"#a23fb0"
],
"access":[
"All Members"
],
"body":[
"Hear from the leader of the #1 wholesale lender in the mortgage industry as he shares his insights for the future of the broker channel."
],
"points":[],
"img":"assets/content/resources/mat-ishbia-keynote-hall-of-aime-2022.jpg"
},
{
"title":"Paul Olbrantz: Coaching Yourself To Success As A New Wholesale Broker/Originator",
"type":"Video",
"cta":"Watch now",
"dur":"Dec 23, 2024",
"pub":"2024-12-23",
"sub":"Broker Playbook",
"series":"Broker Playbook",
"show":"",
"goal":"Run & Grow Your Business",
"topic":"Operations & Systems",
"g":[
"#7a1f55",
"#dd1969"
],
"access":[
"All Members"
],
"body":[
"Learn the steps to succeed as a new wholesale Broker/Originator with Paul Olbrantz, Broker/Owner of Clear2Close Brokers."
],
"points":[],
"img":"assets/content/resources/paul-olbrantz-coaching-yourself-to-success-as-a-new-wholesal.jpg"
},
{
"title":"Jamie Cavanaugh: Navigating While Winning",
"type":"Video",
"cta":"Watch now",
"dur":"Dec 23, 2024",
"pub":"2024-12-23",
"sub":"Sales Rally",
"series":"Sales Rally",
"show":"",
"goal":"Close More Loans",
"topic":"Sales & Conversations",
"g":[
"#1b7a4a",
"#2bb673"
],
"access":[
"All Members"
],
"body":[
"Watch Jamie Cavanaugh on this week's Sales Rally regarding navigating the housing market and how to continue winning for yourself and homeowners."
],
"points":[],
"img":"assets/content/resources/jamie-cavanaugh-navigating-while-winning.jpg"
},
{
"title":"Joe Rychalsky: Social Media for Mortgage Brokers: Going Viral",
"type":"Video",
"cta":"Watch now",
"dur":"Dec 23, 2024",
"pub":"2024-12-23",
"sub":"Broker Playbook",
"series":"Broker Playbook",
"show":"",
"goal":"Get More Business",
"topic":"Marketing & Personal Brand",
"g":[
"#86145a",
"#dd1969"
],
"access":[
"All Members"
],
"body":[
"Get a step-by-step process of how to go viral on social media, and how to use pixels for Facebook and Google Ad tracking with Joe Rychalsky, Co-Founder/Senior Loan Officer at All In Mortgage and CEO of JoeWoo.com."
],
"points":[],
"img":"assets/content/resources/joe-rychalsky-social-media-for-mortgage-brokers-going-viral.jpg"
},
{
"title":"Marc Summers: Gain Direct Referrals From Local Businesses",
"type":"Video",
"cta":"Watch now",
"dur":"Dec 23, 2024",
"pub":"2024-12-23",
"sub":"Grow & Get It",
"series":"Grow & Get It",
"show":"",
"goal":"Get More Business",
"topic":"Leads & Referral Partners",
"g":[
"#0b6b82",
"#20adce"
],
"access":[
"All Members"
],
"body":[
"On this FIRST EVER episode of AIME’s Grow & Get It (hosted by President of Growth Tom Ahles) AIME President of Membership and Broker/Owner of Priority Mortgage Lending, Marc Summers, talks about how to gain direct referrals from local businesses by helping them retain their employees."
],
"points":[],
"img":"assets/content/resources/marc-summers-gain-direct-referrals-from-local-businesses.jpg"
},
{
"title":"Paul Olbrantz: Fund Over $200M in 14 Months",
"type":"Video",
"cta":"Watch now",
"dur":"Dec 23, 2024",
"pub":"2024-12-23",
"sub":"Grow & Get It",
"series":"Grow & Get It",
"show":"",
"goal":"Run & Grow Your Business",
"topic":"Business Planning & Numbers",
"g":[
"#0b1f5b",
"#163a85"
],
"access":[
"All Members"
],
"body":[
"On this episode of AIME’s Grow & Get It, Broker/Owner of Clear2Close Brokers, Paul Olbrantz, talks about how to fund over 200mm within 14 months in an area where most real estate agents only close 4-6 transactions a year. (Hosted by AIME President of Growth Tom Ahles)"
],
"points":[],
"img":"assets/content/resources/paul-olbrantz-fund-over-200m-in-14-months.jpg"
},
{
"title":"Breon Price: How To Market To Local Builders",
"type":"Video",
"cta":"Watch now",
"dur":"Dec 23, 2024",
"pub":"2024-12-23",
"sub":"Grow & Get It",
"series":"Grow & Get It",
"show":"",
"goal":"Get More Business",
"topic":"Leads & Referral Partners",
"g":[
"#4a217a",
"#7a3fb0"
],
"access":[
"All Members"
],
"body":[
"On this episode of AIME’s Grow & Get It, Broker/Owner of Motto Mortgage, Breon Price, talks about how to build a lifelong referral source by marketing to local builders. (Hosted by AIME President of Growth Tom Ahles)"
],
"points":[],
"img":"assets/content/resources/breon-price-how-to-market-to-local-builders.jpg"
},
{
"title":"Ashley Bedford: Producing $100M a year with Referral Partners",
"type":"Video",
"cta":"Watch now",
"dur":"Dec 23, 2024",
"pub":"2024-12-23",
"sub":"Grow & Get It",
"series":"Grow & Get It",
"show":"",
"goal":"Get More Business",
"topic":"Leads & Referral Partners",
"g":[
"#0b2a5b",
"#1893b1"
],
"access":[
"All Members"
],
"body":[
"On this episode of AIME’s Grow & Get It Ashley Bedford, a Mortgage Broker with Patriot Home Funding talks about how to produce $100mm a year by leveraging service providers as referral partners. (hosted by AIME President of Growth Tom Ahles)"
],
"points":[],
"img":"assets/content/resources/ashley-bedford-producing-100m-a-year-with-referral-partners.jpg"
},
{
"title":"RCN: Overcoming Client Objections & Answering Investors",
"type":"Video",
"cta":"Watch now",
"dur":"Dec 23, 2024",
"pub":"2024-12-23",
"sub":"Partner Playbook",
"series":"Partner Playbook",
"show":"",
"goal":"Close More Loans",
"topic":"Sales & Conversations",
"g":[
"#7a1f1a",
"#e0463c"
],
"access":[
"All Members"
],
"body":[],
"points":[],
"img":"assets/content/resources/rcn-overcoming-client-objections-answering-investors.jpg"
},
{
"title":"Jason Perkins: Lead Conversion Fundamentals w/ Bonzo",
"type":"Video",
"cta":"Watch now",
"dur":"Dec 23, 2024",
"pub":"2024-12-23",
"sub":"Jason Perkins | AIME | Bonzo",
"series":"Partner Playbook",
"show":"",
"goal":"Get More Business",
"topic":"Leads & Referral Partners",
"g":[
"#0f5e3f",
"#1b9d6b"
],
"access":[
"All Members"
],
"body":[],
"points":[],
"img":"assets/content/resources/jason-perkins-lead-conversion-fundamentals-w-bonzo.jpg"
},
{
"title":"MyCreditGuy: Vantage 4.0 & FICO 10T: What's Coming & How To Navigate",
"type":"Video",
"cta":"Watch now",
"dur":"Dec 23, 2024",
"pub":"2024-12-23",
"sub":"MyCreditGuy Playbook",
"series":"Partner Playbook",
"show":"",
"goal":"Close More Loans",
"topic":"Loan Products & Guidelines",
"g":[
"#5b2a86",
"#a23fb0"
],
"access":[
"All Members"
],
"body":[],
"points":[],
"img":"assets/content/resources/mycreditguy-vantage-4-0-fico-10t-what-s-coming-how-to-naviga.jpg"
},
{
"title":"MCR V6 Changes with SCP",
"type":"Video",
"cta":"Watch now",
"dur":"Dec 17, 2024",
"pub":"2024-12-17",
"sub":"Partner Playbook",
"series":"Partner Playbook",
"show":"",
"goal":"Run & Grow Your Business",
"topic":"Compliance & Ethics",
"g":[
"#7a1f55",
"#dd1969"
],
"access":[
"All Members"
],
"body":[
"This webinar will review the Mortgage Call Report (MCR) V6 changes. Melissa Harris, CRCM, SCP Compliance Consultant, will discuss tips in the following areas: - Purpose of Changes - Definition Changes - RMLA Section I, II, III Changes - Financial Condition Changes - Supplemental State-Specific Forms (SSSF) - Grace Period - How SCP can Help!"
],
"points":[],
"img":"assets/content/resources/mcr-v6-changes-with-scp.jpg"
}
],
"events":[
{
"title":"AIME Accelerate - Identity Reset",
"date":"JUN 8",
"when":"Mon · 1:00 PM ET",
"type":"Training",
"g":[
"#1b1b3a",
"#dd1969"
],
"body":[
"Every Monday at 1 PM EST",
"Join the email list to stay updated on new AIME Accelerate Sprints."
],
"access":[
"All Members"
],
"img":"assets/content/events/aime-accelerate-identity-reset.jpg"
},
{
"title":"AIME Accelerate - Win the Day, Win the Week",
"date":"JUN 15",
"when":"Mon · 1:00 PM ET",
"type":"Training",
"g":[
"#0b1f5b",
"#20adce"
],
"body":[
"Every Monday at 1 PM EST",
"Join the email list to stay updated on new AIME Accelerate Sprints."
],
"access":[
"All Members"
],
"img":"assets/content/events/aime-accelerate-win-the-day-win-the-week.jpg"
},
{
"title":"AIME Accelerate - Run Toward It",
"date":"JUN 22",
"when":"Mon · 1:00 PM ET",
"type":"Training",
"g":[
"#5b2a86",
"#dd1969"
],
"body":[
"Every Monday at 1 PM EST",
"Join the email list to stay updated on new AIME Accelerate Sprints."
],
"access":[
"All Members"
],
"img":"assets/content/events/aime-accelerate-run-toward-it.jpg"
},
{
"title":"AIME Accelerate - Compound",
"date":"JUN 29",
"when":"Mon · 1:00 PM ET",
"type":"Training",
"g":[
"#1b1b3a",
"#1893b1"
],
"body":[
"Every Monday at 1 PM EST",
"Join the email list to stay updated on new AIME Accelerate Sprints."
],
"access":[
"All Members"
],
"img":"assets/content/events/aime-accelerate-compound.jpg"
},
{
"title":"Mortgage Mornings",
"date":"JUL 1",
"when":"Wednesdays · 10:00 AM ET",
"type":"Virtual",
"g":[
"#0b2a5b",
"#e0463c"
],
"body":[
"Hosted by Jason Frazier at AIME",
"7:00am Pacific | 10:00am Eastern",
"☕ Coffee optional. Clarity required.",
"Mortgage Mornings is a weekly, no B.S. conversation built for brokers who want to start their day focused, sharp, and ahead of the market.",
"This is not a webinar.",
"This is not a sales pitch.",
"This is a working room for brokers who care about growth.",
"Each session is fast, direct, and grounded in what’s actually happening in the broker channel right now. We talk production, positioning, relationships, mindset, and execution. The things that move the needle before the rest of the day gets loud.",
"What to expect",
"Real conversations about what’s working and what’s not",
"Tactical insights you can apply the same day",
"Broker-to-broker perspective, not theory",
"A strong start to your morning with people who get it",
"Come as you are. Camera on or off.",
"Leave with one idea that makes you better.",
"If you are about building momentum before most people hit snooze, this is your room.",
"Please Note: Mortgage Mornings is recorded and the replay will be sent to AIME Members. By joining the call you agree to have any images, video, or content shared with others."
],
"access":[
"All Members"
],
"signup":"https://aimegroup.co/MortgageMornings",
"img":"assets/content/events/mortgage-mornings.jpg",
"recurring":"Weekly"
},
{
"title":"Fuse 2026",
"date":"SEP 24",
"when":"Sep 24–26 · Austin, TX",
"type":"In person",
"loc":"JW Marriott Downtown Austin, TX",
"g":[
"#021649",
"#dd1969"
],
"body":[
"Experience your Community.",
"Running a brokerage today means doing more with less, and doing it faster than ever. At Fuse, we bring the entire independent mortgage community together for three days of connection, strategy, and real solutions built for brokers, by brokers.",
"Whether you’re looking to drive more referrals, find the right partners, or figure out how to scale sustainably, this is where it happens."
],
"access":[
"All Members"
],
"signup":"https://app.brokersarebest.com/dashboard/fuse-registration",
"img":"assets/content/events/fuse-2026.jpg"
},
{
"title":"Fuse 2027",
"date":"SEP 30",
"when":"Sep 30–Oct 2, 2027 · Denver, CO",
"type":"In person",
"loc":"Gaylord Rockies Resort & Convention Center, Denver, CO",
"year":2027,
"g":[
"#021649",
"#20adce"
],
"body":[
"BE THE FIRST TO KNOW",
"Sign up to get updates on registration, speakers, hotel information, and all the details for Fuse 2027 in Denver, CO."
],
"access":[
"All Members"
],
"signup":"https://aimegroup.com/fuse-2027",
"img":"assets/content/events/fuse-2027.jpg"
}
]
};
(function () {
  // Members see one variant of a per-tier Market product: the one for their tier.
  let tier = 'Elite';
  try { const t = localStorage.getItem('amp-proto-tier'); if (['Premium', 'Elite', 'VIP'].includes(t)) tier = t; } catch (e) { /* private mode */ }
  AMP_CONTENT.memberVendors = AMP_CONTENT.vendors.filter((v) => !v.variant || v.variant.includes(tier));
})();
// Card / banner background: the item's image when it has one, else its brand gradient.
window.cardBg = function (x, logo) {
  if (logo && x.logo) return `background:#fff url('${x.logo}') center/58% auto no-repeat`;
  if (x.img) return `background:#0b1f5b url('${x.img}') center/cover no-repeat`;
  const g = x.g || ['#021649', '#20adce'];
  return `background:linear-gradient(135deg,${g[0]},${g[1]})`;
};
