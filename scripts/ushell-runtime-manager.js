const getConfiguration = () => {
  const menu = [
    { text: "General", url: "/content/software-distribution/en/general.html" },
    {
      text: "Adobe Experience Manager",
      url: "/content/software-distribution/en/aem.html",
    },
    {
      text: "AEM as a Cloud Service",
      url: "/content/software-distribution/en/aemcloud.html",
    },
    {
      text: "Adobe Campaign",
      url: "/content/software-distribution/en/campaign.html",
    },
  ];

  return {
    unifiedShellURL: "https://experience.adobe.com",
    appPath: "/downloads",
    faviconAddress:
      "/content/dam/thumbnails/logo/S_AdobeExperienceCloud_24_N@2x.svg",
    homePage: "/content/software-distribution/en/general.html",
    userMenu: menu.map((item) => ({
      name: item.text,
      url: item.url,
    })),
  };
};

async function loadUnifiedShellRuntime() {
  return new Promise((resolve) => {
    const resolver = () => resolve(window["exc-module-runtime"].default);
    if ("exc-module-runtime" in window) {
      resolver();
    } else {
      window.EXC_MR_READY = resolver;
    }
  });
}

const configureRuntime = async (Runtime) => {
  const runtime = new Runtime();
  const donePromise = new Promise((resolve) =>
    runtime.on("ready", () => resolve(runtime))
  );

  runtime.workspaces = getConfiguration().userMenu;

  runtime.favicon = `${new URL(location.href).host}${
    getConfiguration().faviconAddress
  }`;

  runtime.solution = {
    icon: "AdobeExperienceCloud",
    title: "Software Distribution",
  };

  runtime.helpCenter = {
    featured: [
      {
        description: "How to use Software Distribution",
        href: "https://docs.adobe.com/content/help/en/experience-cloud/software-distribution/home.html",
        label: "How to use Software Distribution",
        path: "/:orgId?/(.*)?",
      },
    ],
  };

  runtime.title = document.title;

  const logoutUrl = new URL(new URL(location.href).origin);
  logoutUrl.pathname = "https://localhost/bin/softwaredistribution/logout.html";

  runtime.logoutUrl = logoutUrl.href;

  return donePromise;
};

const loadUnifiedShell = async () => {
  const configuredRuntime = await configureRuntime(
    await loadUnifiedShellRuntime()
  );
  configuredRuntime.done();

  return configuredRuntime;
};

let runtimePromise = loadUnifiedShell();

export async function getUShellRuntime() {
  return await runtimePromise;
}
