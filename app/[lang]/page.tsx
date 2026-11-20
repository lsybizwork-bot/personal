import Link from "next/link";
import { notFound } from "next/navigation";
import { Contact } from "@/components/Contact";
import { LangSwitch, Menu } from "@/components/Menu";
import { getContent, isLang } from "@/content";
import type { Lang, Project } from "@/content/types";

/** 상세 페이지가 있으면 링크로, 없으면 글자로만 표시 */
function ProjectTitle({ project, lang }: { project: Project; lang: Lang }) {
  return project.slug ? <Link href={`/${lang}/projects/${project.slug}`}>{project.title}</Link> : <>{project.title}</>;
}

export default async function Home({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();
  const { profile, career, projectGroups, interests } = getContent(lang);
  const [firstParagraph, ...restParagraphs] = profile.about.paragraphs;

  return (
    <>
      <header className="hero">
        <div className="hl">
          <LangSwitch lang={lang} />
          <div>
            <p>{profile.hero.lead}</p>
            <a className="btn" href="#about">
              {profile.hero.buttonLabel}
            </a>
          </div>
        </div>
        <div className="hr">
          <Menu lang={lang} />
          <div>
            <span className="kick">{profile.hero.kicker}</span>
            <h1>{profile.hero.title}</h1>
          </div>
        </div>
      </header>

      <main id="main">
        <div className="sp" />

        <section id="about" className="split" aria-labelledby="h-about">
          <span className="pg">01 — About</span>
          <div className="prose">
            <h2 id="h-about">{profile.about.title}</h2>
            {firstParagraph && <p className="first">{firstParagraph}</p>}
            {restParagraphs.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
        </section>

        <div className="sp" />

        <section id="career" className="car" aria-label="Career">
          <div className="cl">
            <span className="kick">02 — Career</span>
            <span className="lab">{career.current.label}</span>
            <p className="now">{career.current.title}</p>

            <div className="accs">
              {career.past.length > 0 && (
                <details className="acc">
                  <summary>{career.pastLabel}</summary>
                  <ul className="rows">
                    {career.past.map((c) => (
                      <li key={c.role}>
                        <span>{c.field}</span>
                        <span>{c.role}</span>
                      </li>
                    ))}
                  </ul>
                </details>
              )}
              {career.extraLines?.map((line) => (
                <p className="acc line" key={line}>
                  {line}
                </p>
              ))}
              {career.other.length > 0 && (
                <details className="acc">
                  <summary>{career.otherLabel}</summary>
                  <ul className="rows">
                    {career.other.map((c) => (
                      <li key={c.role}>
                        <span>{c.field}</span>
                        <span>{c.role}</span>
                      </li>
                    ))}
                  </ul>
                </details>
              )}
            </div>
          </div>

          {career.credentials.length > 0 && (
            <div className="cr">
              <span className="kick">{career.credentialsLabel}</span>
              <div className="accs">
                {career.credentials.map((c) => (
                  <details className="acc" key={c.title}>
                    <summary>{c.title}</summary>
                    <ul className="creds">
                      {c.items.map((i) => (
                        <li key={i.name}>
                          {i.name}
                          {i.note && <small>{i.note}</small>}
                        </li>
                      ))}
                    </ul>
                  </details>
                ))}
              </div>
            </div>
          )}
        </section>

        <div className="sp" />

        <section id="projects" className="wide" aria-labelledby="h-projects">
          <div className="hd">
            <h2 id="h-projects">{profile.ui.projectsTitle}</h2>
            <span className="pg">03 — Projects</span>
          </div>
          <div className="accs">
            {projectGroups.map((g) => {
              const withCover = g.projects.filter((p) => p.cover);
              const textOnly = g.projects.filter((p) => !p.cover);
              return (
                <details className="acc grp" key={g.field}>
                  <summary>
                    <span className="gt">{g.field}</span>
                    <span className="gs">
                      {g.summary}
                      {!g.hideCount && (
                        <em>
                          {g.projects.length}
                          {profile.ui.countUnit}
                        </em>
                      )}
                    </span>
                  </summary>
                  <div className="gb">
                    {withCover.length > 0 && (
                      <ul className="pcards">
                        {withCover.map((p) => (
                          <li key={p.title}>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={p.cover} alt="" loading="lazy" />
                            <ProjectTitle project={p} lang={lang} />
                          </li>
                        ))}
                      </ul>
                    )}
                    {textOnly.length > 0 && (
                      <ul className="plist">
                        {textOnly.map((p) => (
                          <li key={p.title}>
                            <ProjectTitle project={p} lang={lang} />
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </details>
              );
            })}
          </div>
        </section>

        <div className="sp" />

        <section id="interests" className="split" aria-labelledby="h-interests">
          <span className="pg">04 — Interests</span>
          <div>
            <h2 id="h-interests" style={{ marginBottom: 40 }}>
              {interests.title}
            </h2>
            <div className="accs">
              {interests.likes.map((l) => (
                <details className="acc like" key={l.title}>
                  <summary>{l.title}</summary>
                  <p>{l.detail}</p>
                </details>
              ))}
              {interests.dislikes.length > 0 && (
                <details className="acc dis">
                  <summary>{interests.dislikesLabel}</summary>
                  <p>{interests.dislikes.join(" · ")}</p>
                </details>
              )}
            </div>
          </div>
        </section>

        <div className="sp" />
      </main>

      <Contact lang={lang} number="05" />
    </>
  );
}
