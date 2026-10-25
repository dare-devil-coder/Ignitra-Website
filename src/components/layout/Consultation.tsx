'use client';
import { trapDialogTab } from '@/lib/accessibility/dialog';
import {
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type KeyboardEvent,
} from 'react';
import { item, siteContent } from '@/lib/content';
import { CloseIcon, Copy } from '@/components/ui/Primitives';
const endpoint = process.env.NEXT_PUBLIC_CONSULTATION_ENDPOINT;
export function Consultation() {
  const dialog = useRef<HTMLDialogElement>(null),
    form = useRef<HTMLFormElement>(null),
    select = useRef<HTMLButtonElement>(null),
    list = useRef<HTMLUListElement>(null),
    opener = useRef<HTMLElement | null>(null),
    controller = useRef<AbortController | null>(null);
  const [expanded, setExpanded] = useState(false),
    [chosen, setChosen] = useState<number | null>(null),
    [active, setActive] = useState(0),
    [serviceError, setServiceError] = useState(false),
    [pending, setPending] = useState(false),
    [success, setSuccess] = useState(false),
    [firstName, setFirstName] = useState(''),
    [errors, setErrors] = useState<Record<string, string>>({});
  useEffect(() => {
    const open = (e: MouseEvent) => {
      const target = (e.target as Element).closest<HTMLAnchorElement>(
        'a[data-consultation]',
      );
      if (!target) return;
      e.preventDefault();
      opener.current = target;
      dialog.current?.showModal();
      document.body.classList.add('dialog-open');
    };
    document.addEventListener('click', open);
    return () => {
      document.removeEventListener('click', open);
      controller.current?.abort();
      document.body.classList.remove('dialog-open');
    };
  }, []);
  useEffect(() => {
    if (expanded)
      list.current
        ?.querySelector<HTMLElement>('[data-option="' + active + '"]')
        ?.focus();
  }, [expanded, active]);
  const close = () => dialog.current?.close();
  const options = [19, 21, 23, 25];
  const selectOption = (index: number) => {
    setChosen(index);
    setExpanded(false);
    setServiceError(false);
    select.current?.focus();
  };
  const onKey = (event: KeyboardEvent) => {
    if (event.key === 'Escape' && expanded) {
      event.preventDefault();
      event.stopPropagation();
      setExpanded(false);
      select.current?.focus();
    }
    if (['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) {
      event.preventDefault();
      setExpanded(true);
      setActive(
        event.key === 'Home'
          ? 0
          : event.key === 'End'
            ? 3
            : (active + (event.key === 'ArrowDown' ? 1 : 3)) % 4,
      );
    }
  };
  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (chosen === null) {
      setServiceError(true);
      select.current?.focus();
      return;
    }
    if (!endpoint || pending) return;
    setPending(true);
    setErrors({});
    controller.current = new AbortController();
    try {
      const payload = Object.fromEntries(new FormData(event.currentTarget));
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        signal: controller.current.signal,
      });
      const result = await response.json();
      if (response.ok && result.ok === true) {
        setFirstName(String(payload.name).trim().split(/\s+/)[0]);
        setSuccess(true);
      } else if (result.errors && typeof result.errors === 'object') {
        setErrors(result.errors);
      }
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError')
        return; /* No unverified server error copy is invented. Backend response contract remains an owner dependency. */
    } finally {
      setPending(false);
    }
  };
  const field = (label: number, record: number) => {
    const a = item('consultation', record).attributes!;
    const name = a.name;
    return (
      <div className="field" key={record}>
        <label htmlFor={'consult-' + name}>
          <Copy section="consultation" n={label} />
        </label>
        <input
          id={'consult-' + name}
          data-content-id={item('consultation', record).id}
          type={a.type}
          name={name}
          autoComplete={a.autocomplete}
          required={'required' in a}
          minLength={a.minlength ? Number(a.minlength) : undefined}
          maxLength={a.maxlength ? Number(a.maxlength) : undefined}
          pattern={
            name === 'phone' ? siteContent.ui.form.phonePattern : a.pattern
          }
          placeholder={a.placeholder}
          inputMode={a.inputmode as 'tel' | undefined}
          aria-invalid={!!errors[name]}
          aria-describedby={errors[name] ? 'error-' + name : undefined}
        />
        {errors[name] && (
          <p className="field-error" id={'error-' + name}>
            {errors[name]}
          </p>
        )}
      </div>
    );
  };
  return (
    <div data-content-section="consultation">
      <dialog
        onKeyDown={trapDialogTab}
        ref={dialog}
        className="consultation-dialog"
        aria-labelledby="consult-title"
        onCancel={(e) => {
          if (expanded) {
            e.preventDefault();
            setExpanded(false);
            select.current?.focus();
          }
        }}
        onClose={() => {
          controller.current?.abort();
          document.body.classList.remove('dialog-open');
          setExpanded(false);
          opener.current?.focus();
        }}
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            const r = e.currentTarget.getBoundingClientRect();
            if (
              e.clientX < r.left ||
              e.clientX > r.right ||
              e.clientY < r.top ||
              e.clientY > r.bottom
            )
              close();
          }
        }}
      >
        <div className="consultation-inner">
          <button
            type="button"
            className="icon-button dialog-close"
            aria-label={item('consultation', 1).attributes?.['aria-label']}
            onClick={close}
          >
            <CloseIcon />
          </button>
          {success ? (
            <div className="consultation-success">
              <h2 id="consult-title">
                {siteContent.clientMessages.thanks}
                {siteContent.clientMessages.thanksSeparator}
                {firstName}
                {siteContent.clientMessages.thanksEnd}
              </h2>
              <p>{siteContent.clientMessages.success}</p>
              <button
                type="button"
                className="button button-primary"
                onClick={close}
              >
                {siteContent.clientMessages.done}
              </button>
            </div>
          ) : (
            <>
              <Copy section="consultation" n={2} as="p" className="eyebrow" />
              <Copy section="consultation" n={3} as="h2" id="consult-title" />
              <Copy
                section="consultation"
                n={4}
                as="p"
                className="consultation-intro"
              />
              <form ref={form} onSubmit={submit}>
                {field(9, 10)}
                {field(11, 12)}
                {field(13, 14)}
                {field(15, 16)}
                <div className="field service-field">
                  <label id="service-label">
                    <Copy section="consultation" n={17} />
                  </label>
                  <button
                    ref={select}
                    type="button"
                    role="combobox"
                    className="service-select"
                    aria-labelledby="service-label"
                    aria-expanded={expanded}
                    aria-controls="service-listbox"
                    aria-haspopup="listbox"
                    aria-required="true"
                    aria-invalid={serviceError}
                    aria-describedby={
                      serviceError ? 'service-error' : undefined
                    }
                    onKeyDown={onKey}
                    onClick={() => {
                      setExpanded(!expanded);
                      setActive(chosen ?? 0);
                    }}
                  >
                    <span>
                      {
                        item(
                          'consultation',
                          chosen === null ? 18 : options[chosen],
                        ).displayText
                      }
                    </span>
                    <svg
                      aria-hidden="true"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    >
                      <path d="m6 9 6 6 6-6" />
                    </svg>
                  </button>
                  {expanded && (
                    <ul
                      ref={list}
                      id="service-listbox"
                      role="listbox"
                      aria-labelledby="service-label"
                      onKeyDown={onKey}
                    >
                      {options.map((n, index) => (
                        <li
                          role="option"
                          data-option={index}
                          key={n}
                          aria-selected={chosen === index}
                          tabIndex={active === index ? 0 : -1}
                          onClick={() => selectOption(index)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault();
                              selectOption(index);
                            }
                          }}
                        >
                          <Copy section="consultation" n={n} as="span" />
                          <Copy
                            section="consultation"
                            n={n + 1}
                            as="span"
                            className="option-hint"
                          />
                        </li>
                      ))}
                    </ul>
                  )}
                  {serviceError && (
                    <p className="field-error" id="service-error">
                      {siteContent.clientMessages.serviceRequired}
                    </p>
                  )}
                </div>
                <input
                  type="hidden"
                  name={item('consultation', 27).attributes?.name}
                  value={
                    chosen === null
                      ? ''
                      : item('consultation', options[chosen]).text
                  }
                />
                <div className="field">
                  <label htmlFor="consult-message">
                    <Copy section="consultation" n={28} />
                  </label>
                  <textarea
                    id="consult-message"
                    name={item('consultation', 29).attributes?.name}
                    maxLength={Number(
                      item('consultation', 29).attributes?.maxlength,
                    )}
                    rows={4}
                  />
                </div>
                <div className="honeypot" aria-hidden="true">
                  <label htmlFor="consult-website">
                    <Copy section="consultation" n={30} />
                  </label>
                  <input
                    id="consult-website"
                    type="text"
                    name={item('consultation', 31).attributes?.name}
                    autoComplete="off"
                    tabIndex={-1}
                  />
                </div>
                <input
                  type="hidden"
                  name={item('consultation', 32).attributes?.name}
                  defaultValue=""
                  ref={(node) => {
                    if (node && !node.value) node.value = String(Date.now());
                  }}
                />
                <button
                  type="submit"
                  className="button button-primary form-submit"
                  disabled={!endpoint || pending}
                >
                  {pending
                    ? siteContent.clientMessages.sending
                    : item('consultation', 33).displayText}
                </button>
                <Copy
                  section="consultation"
                  n={34}
                  as="p"
                  className="privacy-note"
                />
              </form>
            </>
          )}
        </div>
      </dialog>
    </div>
  );
}
