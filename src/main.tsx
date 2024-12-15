import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "@mantine/core/styles.css";

import { MantineProvider } from "@mantine/core";
import App from "./App.tsx";

// biome-ignore lint/style/noNonNullAssertion: <explanation>
createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<MantineProvider defaultColorScheme="auto">
			<App />
		</MantineProvider>
	</StrictMode>,
);
