"use client";

import { useMemo, useState, type FormEvent } from "react";
import DOMPurify from "isomorphic-dompurify";
import "bootstrap/dist/css/bootstrap.min.css";
import "./AccountRecovery.css";

type Entry = Record<string, unknown>;
type Step =
  | "unauth"
  | "account-confirm"
  | "first-party"
  | "logged-in"
  | "unauth-temp"
  | "link-account"
  | "form"
  | "success";
type DialogView = "default" | "account-compromised" | "different-account";

function asEntry(value: unknown): Entry {
  return value !== null && typeof value === "object" && !Array.isArray(value)
    ? (value as Entry)
    : {};
}

function text(entry: Entry, key: string, fallback = ""): string {
  const value = entry[key];
  return typeof value === "string" && value.length > 0 ? value : fallback;
}

function imageUrl(value: unknown): string {
  if (typeof value === "string") return value;
  return text(asEntry(value), "url");
}

function sanitizedHtml(value: string): { __html: string } {
  return { __html: DOMPurify.sanitize(value) };
}

export default function AccountRecovery({
  data,
}: {
  data?: Record<string, unknown>;
}) {
  const content = useMemo(() => {
    const entry = asEntry(data);
    const general = asEntry(entry.general);
    const modal = asEntry(entry.before_you_proceed_model);
    const unauth = asEntry(entry.step1_unauth);
    const firstParty = asEntry(entry.step2_fp_accounts);
    const confirmed = asEntry(entry.step3_account_confirmed);
    const loggedIn = asEntry(entry.step4_logged_in);
    const temp = asEntry(entry.step5_create_temp_account);
    const link = asEntry(entry.step_6_link_accounts);
    const form = asEntry(entry.step_final_form);
    const success = asEntry(entry.success_step);
    const accountBox = asEntry(entry.account_box);
    const assets = asEntry(entry.assets);
    const selfService = asEntry(entry.self_service_paths);

    const gameTitles = Array.isArray(form.game_title)
      ? form.game_title.map((value) => asEntry(value)).filter(
          (item) => item.show_game_title === true,
        )
      : [];
    const systemLabels = Array.isArray(accountBox.system_labels)
      ? accountBox.system_labels.map((value) => asEntry(value))
      : [];

    return {
      bannerText: text(general, "banner_text", "ACCOUNT RECOVERY"),
      bannerImage: imageUrl(general.banner_bg_image),
      locale: text(entry, "locale", "en-us"),
      progressTitle: text(
        general,
        "progress_header_title",
        "Activision Account Recovery Request",
      ),
      backText: text(general, "progress_header_back_button", "Back"),
      startText: text(general, "progress_header_start_text", "Start"),
      finishText: text(general, "progress_header_end_text", "Finish"),
      ubisoftEnabled: general.is_ubisoft_enable === true,
      accountCreationLimit: String(temp.account_creation_limit ?? 3),
      modalHeader: text(modal, "modal_header", "BEFORE YOU PROCEED…"),
      modalContent: text(modal, "modal_content"),
      tempModalContent: text(modal, "create_temp_account_modal_content"),
      modalCancel: text(modal, "close_button_text", "CANCEL"),
      modalContinue: text(modal, "logout_button_text", "LOG OUT TO CONTINUE"),
      landingHeading: text(
        selfService,
        "landing_header",
        "How can we help with your account?",
      ),
      landingBody: text(
        selfService,
        "landing_body",
        "Select an option to find the right support for your issue.",
      ),
      differentAccountAction: text(
        selfService,
        "different_account_button",
        "I need help with a different account issue",
      ),
      compromisedAction: text(
        selfService,
        "account_compromised_button",
        "My account was hacked",
      ),
      compromisedHeading: text(
        selfService,
        "compromised_header",
        "Which of the following describes your issue?",
      ),
      reasonLinkedAccount: text(
        selfService,
        "reason_linked_account",
        "I linked a different account",
      ),
      reasonNoAccess: text(
        selfService,
        "reason_account_access",
        "I can’t access my account",
      ),
      reasonFullControl: text(
        selfService,
        "reason_full_control",
        "Someone else has full control of my account",
      ),
      noneApply: text(selfService, "none_apply_button", "None of these apply"),
      selfServiceContinue: text(selfService, "continue_button", "Continue"),
      differentAccountIntro: text(
        selfService,
        "different_account_intro",
        "Select the issue that best matches what you need help with.",
      ),
      twoFactorTitle: text(
        selfService,
        "two_factor_title",
        "Two-factor authentication",
      ),
      twoFactorBody: text(
        selfService,
        "two_factor_body",
        "Review your two-factor authentication settings.",
      ),
      emailIssueTitle: text(selfService, "email_title", "Email address"),
      emailIssueBody: text(
        selfService,
        "email_body",
        "Get help with the email address on your account.",
      ),
      linkingIssueTitle: text(selfService, "linking_title", "Account linking"),
      linkingIssueBody: text(
        selfService,
        "linking_body",
        "Get help linking or unlinking accounts.",
      ),
      bansIssueTitle: text(selfService, "bans_title", "Ban appeal"),
      bansIssueBody: text(
        selfService,
        "bans_body",
        "Get help with an enforcement action.",
      ),
      credentialsIssueTitle: text(
        selfService,
        "credentials_title",
        "Account credentials",
      ),
      credentialsIssueBody: text(
        selfService,
        "credentials_body",
        "Get help signing in to your account.",
      ),
      elseIssueTitle: text(selfService, "else_title", "Something else"),
      elseIssueBody: text(
        selfService,
        "else_body",
        "Browse other account support options.",
      ),
      unauthContent: text(unauth, "step_1_content"),
      cantLogin: text(unauth, "can_t_login_button_text"),
      login: text(unauth, "login_button_text"),
      firstPartyContent: text(firstParty, "step_2_first_party_content"),
      psnLogin: text(firstParty, "psn_login_button_text"),
      xboxLogin: text(firstParty, "xbox_login_button_text"),
      steamLogin: text(firstParty, "steam_login_button_text"),
      battleLogin: text(firstParty, "battle_net_login_button_text"),
      ubiLogin: text(firstParty, "ubisoft_login_button_text"),
      nintendoLogin: text(firstParty, "nintendo_login_button_text"),
      noLinkedAccounts: text(firstParty, "no_linked_accounts_button_text"),
      confirmedContent: text(confirmed, "step_3_account_confirmed_content"),
      confirmedWarning: text(confirmed, "warning_content"),
      accountQuestion: text(
        confirmed,
        "step_3_logged_in_message",
        "Is this the Activision account you need help recovering?",
      ),
      confirmYes: text(confirmed, "confirm_account_button_yes", "YES"),
      confirmNo: text(confirmed, "confirm_account_button_no", "NO"),
      loggedInTitle: text(loggedIn, "step_4_logged_in_title"),
      loggedInWarning: text(loggedIn, "step_4_attention_box_content"),
      accordionTitle: text(loggedIn, "accordion_dropdown_text"),
      accordionContent: text(loggedIn, "step_4_accordion_content"),
      linkDifferent: text(loggedIn, "link_different_account_button_text"),
      continueToForm: text(loggedIn, "continue_to_form_button_text"),
      tempContent: text(temp, "step_5_title_content"),
      tempWarning: text(temp, "step_5_small_warning_box_content"),
      tempAttention: text(temp, "step_5_attentnion_box_content"),
      tempInstructions: text(temp, "box_list_content"),
      tempButton: text(temp, "create_a_temp_account_button_text"),
      tempVerify: text(temp, "verify_to_continue_button_text"),
      tempBoxTitle: text(temp, "warning_box_title_text"),
      linkWarning: text(link, "step_6_warning_box_content"),
      linkBoxTitle: text(link, "attention_box_title"),
      linkAttention: text(link, "step_6_first_attention_box_content"),
      linkInstructions: text(link, "step_6_second_attention_box_content"),
      linkButton: text(link, "link_account_button_text"),
      linkVerify: text(link, "verify_to_continue_button_text"),
      accountDetailsHeader: text(form, "account_details_header"),
      accountDetailsSubText: text(form, "account_details_sub_text"),
      accountDetailsNote: text(form, "account_details_note_text"),
      requiredText: text(form, "required_text"),
      requiredError: text(form, "required_error_text"),
      emailMainLabel: text(form, "email_main_label"),
      emailSubLabel: text(form, "email_sub_label"),
      emailError: text(form, "email_error_text"),
      dateMainLabel: text(form, "date_main_label"),
      dateSubLabel: text(form, "date_sub_label"),
      dateError: text(form, "date_error_text"),
      gamesLabel: text(form, "affected_games_label"),
      gamesError: text(form, "affected_game_titles_error_text"),
      additionalLabel: text(form, "additional_details_label"),
      additionalSubLabel: text(form, "additional_details_sub_label"),
      additionalError: text(form, "additional_detail_error_text"),
      submitText: text(form, "submit_button_text"),
      submitError: text(form, "submit_error_text"),
      gameTitles,
      accountTitle: text(accountBox, "atvi_account_title"),
      linkedTitle: text(accountBox, "linked_account_title"),
      systemLabels,
      successContent: text(success, "success_content"),
      existsContent: text(success, "case_already_exists_content"),
      errorContent: text(success, "error_content"),
      successHeader: text(success, "success_header"),
      existsHeader: text(success, "case_already_exists_header"),
      errorHeader: text(success, "error_header"),
      asset: (name: string) => imageUrl(assets[name]),
    };
  }, [data]);

  const [step, setStep] = useState<Step>("unauth");
  const [dialogOpen, setDialogOpen] = useState(true);
  const [dialogView, setDialogView] = useState<DialogView>("default");
  const [dialogBackView, setDialogBackView] = useState<DialogView>("default");
  const [modalOpen, setModalOpen] = useState(false);
  const [modalUsesTempCopy, setModalUsesTempCopy] = useState(false);
  const [accountType, setAccountType] = useState<"atvi" | "temp" | "link" | null>(
    null,
  );
  const [tempAccountCreated, setTempAccountCreated] = useState(false);
  const [tempVerificationRequested, setTempVerificationRequested] =
    useState(false);
  const [linkVerificationRequested, setLinkVerificationRequested] =
    useState(false);
  const [selectedReasons, setSelectedReasons] = useState<string[]>([]);
  const [issueAccordionOpen, setIssueAccordionOpen] = useState<string | null>(
    null,
  );
  const [loggedInAccordionOpen, setLoggedInAccordionOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [date, setDate] = useState("");
  const [game, setGame] = useState("");
  const [details, setDetails] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [apiError, setApiError] = useState(
    "Account/profile API is not connected. Login state and linked-account details are placeholders in this preview.",
  );
  const [compromiseStep, setCompromiseStep] = useState("");
  const [caseNumber, setCaseNumber] = useState("{{CASENUMBER}}");
  const [successType, setSuccessType] = useState<
    "success" | "exists" | "error"
  >("success");
  const [progress, setProgress] = useState(15);
  const [backSteps, setBackSteps] = useState<Step[]>([]);

  const reportApiUnavailable = (action: string) => {
    setApiError(
      `API is not working: ${action} is unavailable in this migration preview.`,
    );
  };

  const goTo = (nextStep: Step, nextProgress: number) => {
    setBackSteps((previous) => [...previous, step]);
    setStep(nextStep);
    setProgress(nextProgress);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const goBack = () => {
    setBackSteps((previous) => {
      const next = [...previous];
      const previousStep = next.pop();
      if (previousStep) {
        setStep(previousStep);
        const progressByStep: Record<Step, number> = {
          unauth: 15,
          "account-confirm": 15,
          "first-party": 30,
          "logged-in": 60,
          "unauth-temp": 45,
          "link-account": 60,
          form: 90,
          success: 100,
        };
        setProgress(progressByStep[previousStep]);
      }
      return next;
    });
  };

  const toggleReason = (reason: string) => {
    setSelectedReasons((previous) =>
      previous.includes(reason)
        ? previous.filter((item) => item !== reason)
        : [...previous, reason],
    );
  };

  const submitForm = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors: Record<string, string> = {};

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      nextErrors.email = content.emailError || content.requiredError;
    }
    if (!date) nextErrors.date = content.dateError || content.requiredError;
    if (!game) nextErrors.game = content.gamesError || content.requiredError;
    if (!details.trim()) {
      nextErrors.details = content.additionalError || content.requiredError;
    }

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    reportApiUnavailable("Submitting your account recovery request");
    setSuccessType("error");
    setStep("success");
    setProgress(100);
  };

  const platformButtons = [
    {
      className: "ps",
      provider: "psn",
      label: content.psnLogin,
      image: content.asset("playstation_logo"),
      alt: "PlayStation",
    },
    {
      className: "xbox",
      provider: "xbl",
      label: content.xboxLogin,
      image: content.asset("xbox_logo"),
      alt: "Xbox",
    },
    {
      className: "steam",
      provider: "steam",
      label: content.steamLogin,
      image: content.asset("steam_logo"),
      alt: "Steam",
    },
    {
      className: "bnet",
      provider: "battle",
      label: content.battleLogin,
      image: content.asset("battle_net_logo"),
      alt: "Battle.net",
    },
    ...(content.ubisoftEnabled && content.ubiLogin
      ? [
          {
            className: "ubi",
            provider: "ubi",
            label: content.ubiLogin,
            image: content.asset("ubisoft_logo"),
            alt: "Ubisoft",
          },
        ]
      : []),
    ...(content.nintendoLogin
      ? [
          {
            className: "na",
            provider: "na",
            label: content.nintendoLogin,
            image: content.asset("nintendo_logo"),
            alt: "Nintendo",
          },
        ]
      : []),
  ];
  const alertIcon = content.asset("feather-alert-circle-icon");

  return (
    <div className="account-recovery">
      {dialogOpen ? (
        <dialog className="self-service-paths" open aria-modal="true">
          <main className="dialog-container container">
            <div className="icons">
              <button
                type="button"
                className={`back icon btn btn-link ${dialogView === "default" ? "hidden" : ""}`}
                aria-label="Back"
                onClick={() => {
                  setDialogView(dialogBackView);
                  setSelectedReasons([]);
                }}
              >
                ←
              </button>
              {dialogView !== "default" && alertIcon ? (
                <img
                  className="warning icon"
                  src={alertIcon}
                  alt=""
                  aria-hidden="true"
                />
              ) : null}
            </div>
            {dialogView === "default" ? (
              <section className="default-view view display">
                <h3 className="title dialog-title-row">
                  {alertIcon ? (
                    <img
                      className="warning icon"
                      src={alertIcon}
                      alt=""
                      aria-hidden="true"
                    />
                  ) : null}
                  <span>{content.landingHeading}</span>
                </h3>
                <section className="info">{content.landingBody}</section>
                <section className="cta row">
                  <button
                    type="button"
                    className="different-account-action btn btn-outline-dark col"
                    onClick={() => {
                      setDialogBackView("default");
                      setDialogView("different-account");
                    }}
                  >
                    {content.differentAccountAction}
                  </button>
                  <button
                    type="button"
                    className="account-compromised-action btn btn-dark col"
                    onClick={() => {
                      setSelectedReasons([]);
                      setDialogBackView("default");
                      setDialogView("account-compromised");
                    }}
                  >
                    {content.compromisedAction}
                  </button>
                </section>
              </section>
            ) : null}
            {dialogView === "account-compromised" ? (
              <section className="account-compromised view display">
                <h3>{content.compromisedHeading}</h3>
                <section className="reason-options">
                  {[
                    ["diff-acc-linked", content.reasonLinkedAccount],
                    ["unable-to-access", content.reasonNoAccess],
                    ["full-control", content.reasonFullControl],
                  ].map(([id, label]) => (
                    <div className="form-check" key={id}>
                      <label className="form-check-label" htmlFor={id}>
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id={id}
                          name="reason"
                          value={id}
                          checked={selectedReasons.includes(id)}
                          onChange={() => toggleReason(id)}
                        />
                        {label}
                        <span className="checkmark" />
                      </label>
                    </div>
                  ))}
                </section>
                <button
                  type="button"
                  className="link-button acct-compromised-link btn btn-link"
                  onClick={() => {
                    setDialogBackView("account-compromised");
                    setDialogView("different-account");
                  }}
                >
                  {content.noneApply}
                </button>
                <button
                  type="button"
                  className="continue-request btn btn-dark"
                  disabled={selectedReasons.length === 0}
                  onClick={() => {
                    setDialogOpen(false);
                    setStep("account-confirm");
                  }}
                >
                  {content.selfServiceContinue}
                </button>
              </section>
            ) : null}
            {dialogView === "different-account" ? (
              <section className="different-account view display">
                <p>{content.differentAccountIntro}</p>
                <section className="issue-options">
                  <div className="panel-group" id="modal-acc">
                    {[
                      ["two-factor", content.twoFactorTitle, content.twoFactorBody],
                      ["email", content.emailIssueTitle, content.emailIssueBody],
                      ["linking", content.linkingIssueTitle, content.linkingIssueBody],
                      ["bans", content.bansIssueTitle, content.bansIssueBody],
                      ["account-credentials", content.credentialsIssueTitle, content.credentialsIssueBody],
                      ["else", content.elseIssueTitle, content.elseIssueBody],
                    ].map(([id, title, body]) => (
                      <div className="panel panel-default card" key={id}>
                        <div className="panel-heading card-header" role="tab">
                          <h3 className="panel-title">
                            <button
                              className={`${issueAccordionOpen === id ? "" : "collapsed "}btn btn-link`}
                              type="button"
                              data-toggle="collapse"
                              aria-expanded={issueAccordionOpen === id}
                              onClick={() =>
                                setIssueAccordionOpen((open) =>
                                  open === id ? null : id,
                                )
                              }
                            >
                              <span className="def-txt">{title}</span>
                              <span className="selected-option inactive" />
                            </button>
                          </h3>
                        </div>
                        {issueAccordionOpen === id ? (
                          <div className="panel-collapse collapse show">
                            <div className="panel-body card-body">{body}</div>
                          </div>
                        ) : null}
                      </div>
                    ))}
                  </div>
                </section>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setDialogOpen(false)}
                >
                  Close
                </button>
              </section>
            ) : null}
          </main>
        </dialog>
      ) : null}

      <header
        className="header jumbotron"
        style={
          content.bannerImage
            ? { backgroundImage: `url("${content.bannerImage}")` }
            : undefined
        }
      >
        <div
          id="pageData"
          lang={content.locale}
          data-acctcreationdatelimit={content.accountCreationLimit}
          data-maxtextareacount="1000"
        >
          {content.asset("shield_icon") ? (
            <img
              className="header-icon"
              src={content.asset("shield_icon")}
              alt="Activision Support Shield"
            />
          ) : null}
          <h1>{content.bannerText}</h1>
        </div>
      </header>

      {modalOpen ? (
        <div className="modal display">
          <div
            className="box modal-box before-proceed modal-dialog modal-content"
            role="dialog"
            aria-modal="true"
            aria-labelledby="before-proceed-title"
          >
            {content.asset("modal_close_icon") ? (
              <button
                type="button"
                className="close-button close-modal"
                onClick={() => setModalOpen(false)}
                aria-label="Close"
              >
                <img
                  src={content.asset("modal_close_icon")}
                  alt="Modal Close Button"
                />
              </button>
            ) : (
              <button
                type="button"
                className="close-button close-modal btn btn-link"
                onClick={() => setModalOpen(false)}
                aria-label="Close"
              >
                ×
              </button>
            )}
            <h3 className="title" id="before-proceed-title">
              {content.modalHeader}
            </h3>
            <div
              className={`content default ${modalUsesTempCopy ? "hidden" : ""}`}
              dangerouslySetInnerHTML={sanitizedHtml(content.modalContent)}
            />
            <div
              className={`content temp-acct ${modalUsesTempCopy ? "display" : ""}`}
              dangerouslySetInnerHTML={sanitizedHtml(content.tempModalContent)}
            />
            <div className="button-group row">
              <button
                type="button"
                className="car-button close-modal btn btn-outline-dark col"
                onClick={() => setModalOpen(false)}
              >
                {content.modalCancel}
              </button>
              <button
                type="button"
                className="car-button btn btn-dark col"
                data-redirect="signout"
                onClick={() => {
                  setModalOpen(false);
                  if (accountType === "temp") {
                    setTempVerificationRequested(true);
                  } else if (accountType === "link") {
                    setLinkVerificationRequested(true);
                  }
                  reportApiUnavailable(
                    accountType === "temp"
                      ? "Creating or verifying a temporary account"
                      : accountType === "link"
                        ? "Linking an account"
                        : "Signing in",
                  );
                }}
              >
                {content.modalContinue}
              </button>
            </div>
          </div>
        </div>
      ) : null}

      <main className="acct-recovery container">
        <section className="top-section">
          <div className="title-bar">
            <button
              type="button"
              className={`back-arrow btn btn-link ${backSteps.length && step !== "success" ? "display" : ""}`}
              onClick={goBack}
            >
              {content.asset("back_arrow") ? (
                <img
                  className="arrow-img"
                  src={content.asset("back_arrow")}
                  alt="Back Arrow Image"
                />
              ) : null}
              <span>{content.backText}</span>
            </button>
            <h2 className={`title default ${step === "success" ? "hidden" : ""}`}>
              {content.progressTitle}
            </h2>
            <h2 className={`title success-header ${successType === "success" && step === "success" ? "display" : ""}`}>
              {content.successHeader}
            </h2>
            <h2 className={`title case-exists-header ${successType === "exists" && step === "success" ? "display" : ""}`}>
              {content.existsHeader}
            </h2>
            <h2 className={`title error-header ${successType === "error" && step === "success" ? "display" : ""}`}>
              {content.errorHeader}
            </h2>
          </div>
          {apiError ? (
            <div className="box warning error text-center api-error" role="alert">
              {apiError}
            </div>
          ) : null}
          <div className="prog-wrapper">
            <div
              className="progress-container progress"
              role="progressbar"
              aria-valuenow={progress}
              aria-valuemin={0}
              aria-valuemax={100}
            >
              <div className="prog-bar progress-bar" style={{ width: `${progress}%` }} />
            </div>
            <div className="context">
              <div>{content.startText}</div>
              <div>{content.finishText}</div>
            </div>
          </div>
        </section>

        <section
          className={`step unauth ${step === "unauth" ? "display" : ""}`}
          data-step-percent="15"
        >
          <div className="box">
            {content.asset("activision_large_logo") ? (
              <img
                className="atvi-title"
                src={content.asset("activision_large_logo")}
                alt="ATVI Logo"
              />
            ) : null}
            <div className="content">{content.unauthContent}</div>
            <div className="button-group row">
              <button
                type="button"
                className="car-button btn btn-dark col"
                data-next-step="unauth-temp"
                onClick={() => goTo("unauth-temp", 45)}
              >
                {content.cantLogin}
              </button>
              <button
                type="button"
                className="car-button logo-btn btn btn-dark col"
                data-redirect="login"
                data-account-type="atvi"
                onClick={() => {
                  setAccountType("atvi");
                  setModalUsesTempCopy(false);
                  setModalOpen(true);
                }}
              >
                {content.asset("activision_logo") ? (
                  <img
                    className="atvi-logo"
                    src={content.asset("activision_logo")}
                    alt="ATVI Logo"
                  />
                ) : null}
                <span>{content.login}</span>
                <div className="overlay">
                  {content.asset("overlay_arrow") ? (
                    <img
                      className="overlay-arrow"
                      src={content.asset("overlay_arrow")}
                      alt="Overlay Arrow Image"
                    />
                  ) : null}
                </div>
              </button>
            </div>
          </div>
        </section>

        <section
          className={`step account-confirm ${step === "account-confirm" ? "display" : ""}`}
          data-step-percent="15"
        >
          <div className="initial-warning">
            <div>
              <p>{content.confirmedContent}</p>
            </div>
            <div className="box warning">
              <span className="attention-icon" aria-hidden="true">
                {alertIcon ? <img src={alertIcon} alt="" /> : "!"}
              </span>
              <div>{content.confirmedWarning}</div>
            </div>
          </div>
          <div className="box">
            <div className="content">
              {content.accountQuestion}
            </div>
            <div className="button-group row">
              <button
                type="button"
                className="car-button btn btn-dark col"
                data-next-step="first-party"
                onClick={() => {
                  setCompromiseStep("Partial Compromise - Step 1");
                  goTo("first-party", 15);
                }}
              >
                {content.confirmNo}
              </button>
              <button
                type="button"
                className="car-button btn btn-dark col"
                data-next-step="form"
                onClick={() => {
                  setCompromiseStep("Full Compromise");
                  goTo("form", 90);
                }}
              >
                {content.confirmYes}
              </button>
            </div>
          </div>
        </section>

        <section
          className={`step first-party ${step === "first-party" ? "display" : ""}`}
          data-step-percent="30"
        >
          <div className="initial-warning">
            <div>
              <p>{content.confirmedContent}</p>
            </div>
            <div className="box warning">
              <span className="attention-icon" aria-hidden="true">
                {alertIcon ? <img src={alertIcon} alt="" /> : "!"}
              </span>
              <div>{content.confirmedWarning}</div>
            </div>
          </div>
          <div className="box">
            <div className="title-row">
              {[
                ["playstation_logo", "PSN Logo", ""],
                ["xbox_logo", "Xbox Logo", ""],
                ["steam_logo", "Steam Logo", ""],
                ["battle_net_logo", "Battle Net Logo", ""],
                ...(content.ubisoftEnabled
                  ? [["ubisoft_logo", "Ubisoft Logo", "ubi"]]
                  : []),
                ...(content.nintendoLogin
                  ? [["nintendo_logo", "Nintendo Logo", "na"]]
                  : []),
              ].map(([key, alt, className]) =>
                content.asset(key) ? (
                  <img
                    key={key}
                    className={`title-img ${className}`}
                    src={content.asset(key)}
                    alt={alt}
                  />
                ) : null,
              )}
            </div>
            <div className="content">{content.firstPartyContent}</div>
            <div className="button-group first-party-grid row">
              {platformButtons.map((platform) => (
                <button
                  key={platform.provider}
                  type="button"
                  className={`car-button fp ${platform.className} btn btn-dark col-md-6`}
                  data-redirect={platform.provider}
                  onClick={() =>
                    reportApiUnavailable(`${platform.label} sign-in`)
                  }
                >
                  {platform.image ? (
                    <img
                      className="btn-img"
                      src={platform.image}
                      alt={`${platform.alt} Logo`}
                    />
                  ) : null}
                  <span>{platform.label}</span>
                  <div className="overlay">
                    {content.asset("overlay_arrow") ? (
                      <img
                        className="overlay-arrow"
                        src={content.asset("overlay_arrow")}
                        alt="Overlay Arrow Image"
                      />
                    ) : null}
                  </div>
                </button>
              ))}
            </div>
            <span className="horizontal-serperator" />
            <div className="button-group centered row">
              <button
                type="button"
                className="car-button btn btn-dark col"
                data-next-step="unauth"
                onClick={() => {
                  setCompromiseStep("Partial Compromise - Step 1");
                  goTo("unauth", 15);
                }}
              >
                {content.noLinkedAccounts}
              </button>
            </div>
          </div>
        </section>

        <section
          className={`step logged-in ${step === "logged-in" ? "display" : ""}`}
          data-step-percent="60"
        >
          <div className="box">
            <h3 className="title">{content.loggedInTitle}</h3>
            <div className="box accounts">
              <div className="box-container">
                <div className="title">{content.accountTitle}</div>
                <div className="list">
                  <span className="atvi-email">N/A</span>
                  <span className="atvi-acct">N/A</span>
                </div>
              </div>
              <span className="seperator" />
              <div className="box-container">
                <div className="title">{content.linkedTitle}</div>
                <div className="list">
                  {content.systemLabels.map((label, index) => {
                    const provider = text(label, "system_value");
                    return (
                      <span
                        className={`atvi-${provider} atvi-platform-label`}
                        data-platform={provider}
                        key={provider || index}
                      >
                        {text(label, "system_label")}: <span className="acct">N/A</span>
                      </span>
                    );
                  })}
                </div>
              </div>
            </div>
            <div className="box warning">
              <span className="attention-icon" aria-hidden="true">
                {alertIcon ? <img src={alertIcon} alt="" /> : "!"}
              </span>
              <div className="pre-line">{content.loggedInWarning}</div>
            </div>
          </div>
          <div
            className={`box accordion ${loggedInAccordionOpen ? "expanded" : ""}`}
          >
            <button
              type="button"
              className="accordion-trigger btn btn-link"
              aria-expanded={loggedInAccordionOpen}
              onClick={() =>
                setLoggedInAccordionOpen((open) => !open)
              }
            >
              {content.asset("dropdown_caret") ? (
                <img
                  className="accordion-trigger-icon"
                  src={content.asset("dropdown_caret")}
                  alt="Accordion Trigger Icon"
                />
              ) : null}
              <span>{content.accordionTitle}</span>
            </button>
            <div className="collapsible-content">
              <div className="pre-line">{content.accordionContent}</div>
              <div className="button-group centered row">
                <button
                  type="button"
                  className="car-button btn btn-dark col"
                  onClick={() => {
                    setAccountType("link");
                    setModalUsesTempCopy(false);
                    setModalOpen(true);
                  }}
                >
                  {content.linkDifferent}
                </button>
              </div>
            </div>
          </div>
          <div className="button-group centered toggle-display row">
            <button
              type="button"
              className="car-button btn btn-dark col"
              data-next-step="form"
              data-full-comp="true"
              onClick={() => {
                setCompromiseStep("Full Compromise");
                goTo("form", 90);
              }}
            >
              {content.continueToForm}
            </button>
          </div>
        </section>

        <section
          className={`step unauth-temp ${step === "unauth-temp" ? "display" : ""}`}
          data-step-percent="45"
        >
          {tempVerificationRequested ? null : (
            <div className="auth-content">
              <div>{content.tempContent}</div>
              <div className="box warning error text-center">
                {content.tempWarning}
              </div>
            </div>
          )}
          <div className="box">
            <h3 className="title">{content.tempBoxTitle}</h3>
            <div
              className="box warning"
              dangerouslySetInnerHTML={sanitizedHtml(content.tempAttention)}
            />
            <div
              dangerouslySetInnerHTML={sanitizedHtml(content.tempInstructions)}
            />
          </div>
          {!tempVerificationRequested ? (
            <div className="button-group centered row">
              <a
                id="tempAccountLink"
                target="profileWindow"
                rel="noreferrer"
                className="col"
              >
                <button
                  type="button"
                  className="car-button create btn btn-dark"
                  data-redirect="login"
                  data-account-type="temp"
                  onClick={() => {
                    setAccountType("temp");
                    setTempAccountCreated(true);
                    setModalUsesTempCopy(true);
                    setModalOpen(true);
                  }}
                >
                  {content.tempButton}
                </button>
              </a>
            </div>
          ) : null}
          {tempVerificationRequested ? (
            <div className="button-group centered row">
              <button
                type="button"
                className="car-button verify btn btn-dark col"
                data-next-step="logged-in"
                data-trigger="temp"
                onClick={() =>
                  reportApiUnavailable("Verifying the temporary account")
                }
              >
                {content.tempVerify}
              </button>
            </div>
          ) : null}
        </section>

        <section
          className={`step link-account ${step === "link-account" ? "display" : ""}`}
          data-step-percent="60"
        >
          {!linkVerificationRequested ? (
            <div className="box warning error text-center acct-detect">
              {content.linkWarning}
            </div>
          ) : null}
          <div className="box">
            <h3 className="title">{content.linkBoxTitle}</h3>
            <div
              className="box warning"
              dangerouslySetInnerHTML={sanitizedHtml(content.linkAttention)}
            />
            <div
              dangerouslySetInnerHTML={sanitizedHtml(content.linkInstructions)}
            />
          </div>
          <div className="button-group centered row">
            <a
              className="link-account-anchor col"
              target="profileWindow"
              rel="noreferrer"
            >
              {!linkVerificationRequested ? (
                <button
                  type="button"
                  className="car-button link-acct btn btn-dark"
                  data-redirect="login"
                  data-account-type="link"
                  onClick={() => {
                    setAccountType("link");
                    setModalUsesTempCopy(false);
                    setModalOpen(true);
                  }}
                >
                  {content.linkButton}
                </button>
              ) : null}
            </a>
            {linkVerificationRequested ? (
              <button
                type="button"
                className="car-button link-verify btn btn-dark col"
                data-next-step="logged-in"
                data-trigger="link"
                onClick={() =>
                  reportApiUnavailable("Verifying linked accounts")
                }
              >
                {content.linkVerify}
              </button>
            ) : null}
          </div>
        </section>

        <section
          className={`step form ${step === "form" ? "display" : ""}`}
          data-step-percent="90"
        >
          <div>
            <h3>{content.accountDetailsHeader}</h3>
            <p>{content.accountDetailsSubText}</p>
          </div>
          <div className="box">
            <div className="box accounts">
              <div className="box-container">
                <div className="title">{content.accountTitle}</div>
                <div className="list">
                  <span className="atvi-email">{email || "N/A"}</span>
                  <span className="atvi-acct">N/A</span>
                </div>
              </div>
              <span className="seperator" />
              <div className="box-container">
                <div className="title">{content.linkedTitle}</div>
                <div className="list">
                  {content.systemLabels.map((label, index) => {
                    const provider = text(label, "system_value");
                    return (
                      <span className={`atvi-${provider}`} key={provider || index}>
                        {text(label, "system_label")}: <span className="acct">N/A</span>
                      </span>
                    );
                  })}
                </div>
              </div>
            </div>
            {tempAccountCreated ? (
              <div className="note">{content.accountDetailsNote}</div>
            ) : null}
          </div>
          <form id="submitForm" className="submit-form" onSubmit={submitForm}>
            <div>*{content.requiredText}</div>
            <div className="email-date-row row">
              <div className="input-group form-group col-md-6">
                <div className="field-title">*{content.emailMainLabel}</div>
                <label htmlFor="email">
                  <span>{content.emailSubLabel}</span>
                  <input
                    className="form-control"
                    type="email"
                    id="email"
                    name="Email__old"
                    placeholder="johndoe@gmail.com"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                  />
                </label>
                <span className={`error-text email-error ${errors.email ? "display" : ""}`}>
                  {errors.email || content.emailError}
                </span>
              </div>
              <div className="input-group form-group col-md-6">
                <div className="field-title">*{content.dateMainLabel}</div>
                <label htmlFor="date">
                  <span>{content.dateSubLabel}</span>
                  <input
                    className="form-control"
                    type="date"
                    id="date"
                    name="Date__c"
                    max={new Date().toISOString().slice(0, 10)}
                    value={date}
                    onChange={(event) => setDate(event.target.value)}
                  />
                </label>
                <span className={`error-text date-error ${errors.date ? "display" : ""}`}>
                  {errors.date || content.dateError}
                </span>
              </div>
            </div>
            <div className="affected-games form-group">
              <div className="field-title">*{content.gamesLabel}</div>
              <div id="game-title-container" className="checkbox-container">
                {content.gameTitles.map((item, index) => {
                  const value = text(item, "game_title_value");
                  return (
                    <label htmlFor={value} key={value || index}>
                      <input
                        type="radio"
                        className="game-title"
                        name="game-title"
                        id={value}
                        value={value}
                        checked={game === value}
                        onChange={(event) => setGame(event.target.value)}
                      />
                      {text(item, "game_title_name")}
                    </label>
                  );
                })}
              </div>
              <span className={`error-text game-title-error ${errors.game ? "display" : ""}`}>
                {errors.game || content.gamesError}
              </span>
            </div>
            <div className="addition-details form-group">
              <div className="field-title">*{content.additionalLabel}</div>
              <label htmlFor="detailsText">
                <span>{content.additionalSubLabel}</span>
                <textarea
                  className="additional-details-text form-control"
                  id="detailsText"
                  rows={6}
                  name="Issue_details"
                  maxLength={1000}
                  value={details}
                  onChange={(event) => setDetails(event.target.value)}
                />
                <span className="text-counter">
                  <span className="current-count">{details.length}</span>
                  &nbsp;/&nbsp;
                  <span className="max-count">1000</span>
                </span>
                <span className={`error-text details-error ${errors.details ? "display" : ""}`}>
                  {errors.details || content.additionalError}
                </span>
              </label>
            </div>
            <div className="g-recaptcha" data-sitekey="" aria-disabled="true" />
            <input type="hidden" id="g-cc" name="g-cc" />
            <input type="hidden" name="language" value={content.locale} />
            <input
              type="hidden"
              id="submission-step"
              name="Submission_Step__c"
              value={compromiseStep}
              readOnly
            />
            <input
              type="hidden"
              id="isUbisoftEnabled"
              name="isUbisoftEnabled"
              value={String(content.ubisoftEnabled)}
            />
            {successType === "error" && step === "success" ? (
              <div className="box warning error text-center submit-error">
                {content.submitError}
              </div>
            ) : null}
            <div className="button-group centered row">
              <button
                type="submit"
                className="car-button btn btn-dark col"
                id="submitFormButton"
              >
                {content.submitText}
              </button>
            </div>
          </form>
        </section>

        <section
          className={`step success ${step === "success" ? "display" : ""}`}
          data-step-percent="100"
        >
          <div className="centered">
            <div
              className={`success-content message ${successType === "success" ? "display" : ""}`}
              dangerouslySetInnerHTML={sanitizedHtml(
                content.successContent.replace("{{CASENUMBER}}", caseNumber),
              )}
            />
            <div
              className={`exists-content message ${successType === "exists" ? "display" : ""}`}
              dangerouslySetInnerHTML={sanitizedHtml(content.existsContent)}
            />
            <div
              className={`error-content message ${successType === "error" ? "display" : ""}`}
              dangerouslySetInnerHTML={sanitizedHtml(content.errorContent)}
            />
          </div>
        </section>
      </main>
    </div>
  );
}
