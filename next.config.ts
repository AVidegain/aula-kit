import type { NextConfig } from "next"

const nextConfig: NextConfig = {
    output: "export",
    basePath: "/aula-kit",
    images: {
        unoptimized: true,
    },
}

export default nextConfig