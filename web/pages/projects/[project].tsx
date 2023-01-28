import { useRouter } from "next/router";
import Dataset from "../../components/project/Dataset";
import Commands from "../../components/project/Commands";
import Link from "next/link";

export default function Project() {
  const router = useRouter();

  return (
    <div>
      <div>
        <Link href="/">
          Projects
        </Link>
        <p>ssss</p>
      </div>
      <div>
        <div>
          <Dataset projectId={router.query.project as string} />
        </div>
        <div>
          <Commands projectId={router.query.project as string} />
        </div>
      </div>
    </div>
  );
}
