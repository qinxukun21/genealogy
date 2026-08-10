import { defineConfig, type Plugin } from "vite";
import uni from "@dcloudio/vite-plugin-uni";
import * as fs from "node:fs";
import * as path from "node:path";

function copyRecursive(src: string, dest: string) {
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) copyRecursive(srcPath, destPath);
    else fs.copyFileSync(srcPath, destPath);
  }
}

/**
 * 把根目录 cloudfunctions/ 复制进编译产物，使微信开发者工具
 * 能在项目内（dist/dev/mp-weixin/cloudfunctions）看到并部署云函数。
 * 仅在构建启动时复制一次；云函数改动直接上传即可，无需重编译。
 */
function copyCloudfunctions(): Plugin {
  let outDir = "";
  return {
    name: "copy-cloudfunctions",
    configResolved(config) {
      outDir = config.build.outDir || process.env.UNI_OUTPUT_DIR || "";
    },
    buildStart() {
      if (!outDir) return;
      const src = path.resolve(process.cwd(), "cloudfunctions");
      const dest = path.resolve(outDir, "cloudfunctions");
      if (fs.existsSync(src)) copyRecursive(src, dest);
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [uni(), copyCloudfunctions()],
});