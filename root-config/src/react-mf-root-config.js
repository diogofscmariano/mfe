import {
  constructRoutes,
  constructApplications,
  constructLayoutEngine,
} from "single-spa-layout";
import { registerApplication, start } from "single-spa";
import { contextPath } from "./utils/context";
import { fetchWithCache } from "@react-mf/api";

const routes = constructRoutes(document.querySelector("#single-spa-layout"), {
  loaders: {
    topNav: "<h1>Loading topnav</h1>",
  },
  errors: {
    topNav: "<h1>Failed to load topnav</h1>",
  },
});
const applications = constructApplications({
  routes,
  loadApp: ({ name }) => System.import(name),
});
// Delay starting the layout engine until the styleguide CSS is loaded
const layoutEngine = constructLayoutEngine({
  routes,
  applications,
  active: false,
});

applications.forEach(registerApplication);

const pathJoin = (prefix, suffix) => {
  const prefixHasSeparator = prefix.endsWith("/");
  const suffixHasSeparator = suffix.startsWith("/");
  const sep = prefixHasSeparator || suffixHasSeparator ? "" : "/";
  return prefix + sep + suffix;
};

System.import("@react-mf/styleguide").then(() => {
  // Activate the layout engine once the styleguide CSS is loaded
  fetchWithCache("config").subscribe((data) => {
    data.results.apps.forEach((appConfig) => {
      const bundleUrl = pathJoin(appConfig.baseUrl, appConfig.bundleName);
      const basename = pathJoin(contextPath, appConfig.id);
      registerApplication(
        appConfig.id,
        () => System.import(bundleUrl),
        (location) => location.pathname.startsWith(basename),
        {
          routerPrefix: basename,
          appBaseUrl: appConfig.baseUrl,
          domMountPointElement: document.getElementsByTagName("main")[0],
        }
      );
    });

    layoutEngine.activate();
    start();
  });
});
