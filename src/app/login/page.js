import { Suspense } from "react";
import LoginContent from "./LoginContent";

export default function LoginPage() {
    return (
        <Suspense fallback={<p className="text-center text-white mt-10">Cargando...</p>}>
            <LoginContent />
        </Suspense>
    );
}
