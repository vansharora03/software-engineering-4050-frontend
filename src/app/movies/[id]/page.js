import MovieCard from "@/components/MovieCard"
import { useRouter } from "next/router"
export default function MovieInfo() {
    const router = useRouter();
    const {id} = router.query;
    return (
        <div>

        </div>
    )
}