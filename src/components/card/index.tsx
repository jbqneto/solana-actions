import Image from "next/image";
export const Card = ({ children, className = '' }: { children: React.ReactNode, className?: string }) => (
    <div className={`bg-gray-800 rounded-lg shadow-lg overflow-hidden ${className}`}>
        {children}
    </div>
)

export const CardHeader = ({ children }: { children: React.ReactNode, className?: string }) => (
    <div className="px-4 py-2">
        {children}
    </div>
)

export const CardContent = ({ children }: { children: React.ReactNode, className?: string }) => (
    <div className="px-4 py-2">
        {children}
    </div>
)

export const CardImage = ({ src, alt }: { src: string; alt: string, className?: string }) => (
    <div className="relative w-full h-48">
        <Image
            src={src}
            alt={alt}
            layout="fill"
            objectFit="cover"
        />
    </div>
)

export const CardTitle = ({ children }: { children: React.ReactNode, className?: string }) => (
    <h2 className="text-2xl font-bold text-center text-gray-100">{children}</h2>
)

export const CardDescription = ({ children }: { children: React.ReactNode, className?: string }) => (
    <p className="text-center text-gray-300">{children}</p>
)

export const CardButton = ({ children, onClick }: { children: React.ReactNode, onClick?: () => void }) => (
    <button
        onClick={onClick}
        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition duration-200"
    >
        {children}
    </button>
)