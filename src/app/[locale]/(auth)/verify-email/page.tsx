import { useTranslations } from "next-intl";

export const metadata = {
  title: "Verify Email | Avaque",
  description: "Verify your email address",
};

export default function VerifyEmailPage() {
  const t = useTranslations("Auth");

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900 dark:text-gray-100">
            {t("verifyEmail.title")}
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            {t("verifyEmail.description")}
          </p>
        </div>

        <div className="mt-8 space-y-6">
          <div className="rounded-md shadow-sm -space-y-px">
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg text-sm text-gray-500 dark:text-gray-400">
              <p>{t("verifyEmail.spamNote")}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
