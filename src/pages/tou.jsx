import React from "react";

const Tou = () => {
  return (
    <div className="bg-gradient-to-r pb-5 from-slate-100 to-slate-200 pt-[110px] flex flex-col items-center  ">
      <div className="max-w-3xl pt-20 pb-10 mx-auto w-[70%]">
        <h1 className="text-3xl font-bold mb-4 text-center">Terms of Use</h1>
        <div className="text-base mt-4 mb-4">
          <p className="text-center">
            Welcome to Pic Pursuit! By using our website, you agree to the
            following terms:
          </p>

          <ol className="list-decimal list-inside mt-4">
            <li className="mb-4">
              <div className="text-center mb-2">
                <strong>Acceptance of Terms:</strong>
              </div>
              <p className="text-left">
                By accessing or using Pic Pursuit, you agree to be bound by
                these Terms of Use and all applicable laws and regulations. If
                you do not agree with any of these terms, you are prohibited
                from using or accessing this site.
              </p>
            </li>
            <li className="mb-4">
              <div className=" mt-4 mb-4">
                <strong>Use License:</strong>
              </div>
              <p className="text-left">
                Permission is granted to temporarily download one copy of the
                materials (information or software) on Pic Pursuit's website for
                personal, non-commercial transitory viewing only. This is the
                grant of a license, not a transfer of title, and under this
                license, you may not:
              </p>
              <ul
                style={{ listStyleType: "disc", paddingLeft: "1em" }}
                className=" text-left  list-inside ml-4 mt-4"
              >
                <li>Modify or copy the materials;</li>
                <li>
                  Use the materials for any commercial purpose, or for any
                  public display (commercial or non-commercial);
                </li>
                <li>
                  Attempt to decompile or reverse engineer any software
                  contained on Pic Pursuit's website;
                </li>
                <li>
                  Remove any copyright or other proprietary notations from the
                  materials; or
                </li>
                <li>
                  Transfer the materials to another person or "mirror" the
                  materials on any other server.
                </li>
              </ul>
            </li>

            <li className="mb-4">
              <div className="text-center mt-4 mb-2">
                <strong>Photographer's Responsibilities:</strong>
              </div>
              Photographers using Pic Pursuit agree that:
              <ul
                style={{ listStyleType: "disc", paddingLeft: "1em" }}
                className=" text-left  list-inside ml-4 mt-4"
              >
                <li>
                  They will obtain necessary permissions or releases when
                  photographing individuals in private settings or when their
                  likeness is recognizable and used commercially.
                </li>
                <li>
                  They will accurately represent the subjects of their
                  photographs and avoid misleading manipulation or editing that
                  changes the fundamental reality of the image.
                </li>
                <li>
                  They will treat their subjects with dignity and respect,
                  avoiding exploitation or misrepresentation.
                </li>
                <li>
                  They will comply with all relevant laws and regulations
                  governing photography, including those related to copyright,
                  privacy, and any local or international regulations.
                </li>
                <li>
                  They will respect the intellectual property rights of others,
                  including trademarks and recognizable branding, ensuring that
                  their photographs do not infringe on these rights.
                </li>
                <li>
                  They will provide proper attribution if required for any
                  third-party content included in their photographs.
                </li>
                <li>
                  They will ensure the quality and integrity of their
                  photographs, providing high-resolution images free from
                  technical defects to buyers.
                </li>
                <li>
                  They will provide prompt and courteous customer service to
                  buyers, addressing any inquiries or issues related to their
                  photographs in a timely manner.
                </li>
                <li>
                  They will conduct themselves in a professional manner in all
                  interactions related to their photography business,
                  maintaining a positive reputation within the Pic Pursuit
                  community.
                </li>
                <li>
                  They will minimize their environmental impact in their
                  photography practices, such as reducing waste and using
                  eco-friendly materials when possible.
                </li>
              </ul>
            </li>

            <li className="mb-4 mt-4">
              <div className="text-center mb-2">
                <strong>Disclaimer:</strong>
              </div>
              The materials on Pic Pursuit's website are provided on an 'as is'
              basis. Pic Pursuit makes no warranties, expressed or implied, and
              hereby disclaims and negates all other warranties including,
              without limitation, implied warranties or conditions of
              merchantability, fitness for a particular purpose, or
              non-infringement of intellectual property or other violation of
              rights.
            </li>
            <li className="mb-4 mt-4">
              <div className="text-center mb-2">
                <strong>Limitations:</strong>
              </div>
              In no event shall Pic Pursuit or its suppliers be liable for any
              damages (including, without limitation, damages for loss of data
              or profit, or due to business interruption) arising out of the use
              or inability to use the materials on Pic Pursuit's website, even
              if Pic Pursuit or a Pic Pursuit authorized representative has been
              notified orally or in writing of the possibility of such damage.
              Because some jurisdictions do not allow limitations on implied
              warranties, or limitations of liability for consequential or
              incidental damages, these limitations may not apply to you.
            </li>
            <li className="mb-4 mt-4">
              <div className="text-center mb-2">
                <strong>Links:</strong>
              </div>
              Pic Pursuit has not reviewed all of the sites linked to its
              website and is not responsible for the contents of any such linked
              site. The inclusion of any link does not imply endorsement by Pic
              Pursuit of the site. Use of any such linked website is at the
              user's own risk.
            </li>
            <li className="mb-4 mt-4">
              <div className="text-center mb-2">
                <strong>Modifications:</strong>
              </div>
              Pic Pursuit may revise these terms of use for its website at any
              time without notice. By using this website you are agreeing to be
              bound by the then current version of these terms of use.
            </li>
            <li>
              <div className="text-center mb-2 mt-4">
                <strong>Governing Law:</strong>
              </div>
              These terms and conditions are governed by and construed in
              accordance with the laws of Utrecht, the Netherlands, and you
              irrevocably submit to the exclusive jurisdiction of their courts.
            </li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default Tou;
