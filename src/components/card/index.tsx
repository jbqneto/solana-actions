import Image from "next/image";
export const Card = ({ children, className = '' }: { children: React.ReactNode, className?: string }) => (
    <div className={`bg-gray-800 rounded-lg shadow-lg overflow-hidden ${className}`}>
        {children}
    </div>
)

export const CardHeader = ({ children }: { children: React.ReactNode, className?: string }) => (
    <div className="px-6 py-4">
        {children}
    </div>
)

export const CardContent = ({ children }: { children: React.ReactNode, className?: string }) => (
    <div className="px-6 py-4">
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

export const CenteredCard = ({ title, img, description }: { title: string, img: string, description: string }) => (
    <Card className="w-full max-w-md mx-auto">
        <CardImage src={img} alt="Placeholder image" />
        <CardHeader>
            <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
            <CardDescription>
                {description}
            </CardDescription>
        </CardContent>
    </Card>
)