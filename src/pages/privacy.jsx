import React from "react";

const Privacy = () => {
  return (
    <div className="bg-gradient-to-r pb-5 from-slate-100 to-slate-200 pt-[110px] flex flex-col items-center  ">
      <div className="max-w-3xl pt-20 pb-10 mx-auto w-[70%]">
        <h1 className="text-3xl font-bold mb-4 text-center">
          Privacy Statement
        </h1>
        <div className="text-base mt-4 mb-4">
          <p>
            Your privacy is important to us. This Privacy Policy outlines the
            types of personal information that is received and collected by Pic
            Pursuit and how it is used.
          </p>
          <h2 className="text-xl font-semibold mt-4 mb-2">
            1. Information Collection and Use:
          </h2>
          <p>
            Pic Pursuit collects personal information from photographers,
            including but not limited to name, email address, and payment
            information. This information is used for the purpose of providing
            and improving the service, to notify users of updates, and to
            contact users for marketing purposes.
          </p>

          <h2 className="text-xl font-semibold mt-4 mb-2">2. Log Files:</h2>
          <p>
            Like many other websites, Pic Pursuit makes use of log files. The
            information inside the log files includes internet protocol (IP)
            addresses, type of browser, Internet Service Provider (ISP),
            date/time stamp, referring/exit pages, and number of clicks to
            analyze trends, administer the site, track user’s movement around
            the site, and gather demographic information.
          </p>

          <h2 className="text-xl font-semibold mt-4 mb-2">
            3. Cookies and Web Beacons:
          </h2>
          <p>
            Pic Pursuit uses cookies to store information about visitors'
            preferences, to record user-specific information on which pages the
            user accesses or visits, and to personalize or customize our web
            page content based upon visitors' browser type or other information
            that the visitor sends via their browser.
          </p>

          <h2 className="text-xl font-semibold mt-4 mb-2">4. Security:</h2>
          <p>
            Pic Pursuit is committed to ensuring that your information is
            secure. In order to prevent unauthorized access or disclosure,
            suitable physical, electronic, and managerial procedures have been
            put in place to safeguard and secure the information collected
            online.
          </p>

          <h2 className="text-xl font-semibold mt-4 mb-2">
            5. Changes to Privacy Policy:
          </h2>
          <p>
            Pic Pursuit may update this Privacy Policy from time to time. We
            will notify you of any changes by posting the new Privacy Policy on
            this page.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Privacy;
