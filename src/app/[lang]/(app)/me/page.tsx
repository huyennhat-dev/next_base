import { ToggleThemeBtn } from "@/components/global/toggle-theme";
import DataBody from "./component/data-body";
import { getDictionary } from "@/configs/dictionaries";
import { Locale } from "@/configs/i18n-config";
import React from "react";

type Props = {
  params: { lang: Locale };
};

const MePage = async ({ params: { lang } }: Props) => {
  const dict = await getDictionary(lang); // en

  return (
    <div>
      <h1>{dict.app.title}</h1>
      <ToggleThemeBtn/>
      <DataBody />

    </div>
  );
};

export default MePage;
