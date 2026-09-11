import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { visualizer } from "rollup-plugin-visualizer";

export default defineConfig(({ mode }) => {
  const analyze = mode === "analyze" || process.env.ANALYZE === "true";

  return {
    plugins: [
      react(),
      ...(analyze
        ? [
            visualizer({
              filename: "dist/stats.html",
              template: "treemap",
              gzipSize: true,
              brotliSize: true,
              open: false,
            }),
            visualizer({
              filename: "dist/stats.json",
              template: "raw-data",
              gzipSize: true,
              brotliSize: true,
              open: false,
            }),
          ]
        : []),
    ],
    resolve: {
      alias: [{ find: /^events$/, replacement: "events/" }],
    },
    build: {
      rolldownOptions: {
        output: {
          codeSplitting: {
            groups: [
              {
                name: "react-vendor",
                test: /node_modules[\\/]react(?:-dom|-router)?[\\/]/,
                priority: 30,
              },
              {
                name: "mui-icons-vendor",
                test: /node_modules[\\/]@mui[\\/]icons-material[\\/]/,
                priority: 25,
              },
              {
                name: "mui-vendor",
                test: /node_modules[\\/]@mui[\\/]/,
                priority: 20,
              },
              {
                name: "charts-vendor",
                test: /node_modules[\\/]recharts[\\/]/,
                priority: 20,
              },
              {
                name: "vendor",
                test: /node_modules[\\/]/,
                minShareCount: 2,
                minSize: 20000,
                priority: 1,
              },
            ],
          },
        },
      },
    },
  };
});
