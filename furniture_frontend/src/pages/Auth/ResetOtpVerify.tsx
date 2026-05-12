import ResetOtpVerifyForm from "@/components/Auth/ResetOtpVerifyForm";

function ResetOtpVerify() {
  return (
    <>
      <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
        <div className="flex w-full max-w-sm flex-col gap-6 md:max-w-lg lg:max-w-xl">
          <ResetOtpVerifyForm />
        </div>
      </div>
    </>
  );
}

export default ResetOtpVerify;
