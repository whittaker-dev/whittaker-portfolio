import { SectionHeader } from "@/packages/components";
import { SplitNames } from "@/packages/constants";
import { useFeatureSplit } from "@/packages/hooks";
import { t } from "i18next";

const Contact = () => {
  const { isTreatmentActive } = useFeatureSplit(SplitNames.CONTACT_SECTION);

  console.log("isTreatmentActive", isTreatmentActive);
  return (
    <div id="contact" className="mb-56">
      <SectionHeader
        title={t("contact")}
        description={t("contact_desc")}
        showUnderline
      />

      {!isTreatmentActive ? (
        <div className="text-center font-boldonse text-3xl font-bold mt-10 text-green-primary">
          {t("coming_soon")}
        </div>
      ) : (
        <div className="text-center font-boldonse text-3xl font-bold mt-10 text-green-primary">
          {t("contact")}
        </div>
      )}
    </div>
  );
};

export default Contact;
