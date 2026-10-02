import type { NextConfig } from "next"

const nextConfig: NextConfig = {
    output: "export",
    basePath: "/aulakit",
    images: {
        unoptimized: true,
    },
}

export default nextConfig