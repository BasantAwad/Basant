import React, { useEffect, useRef } from 'react';
import { personal } from '../data/personal';
import './About.css';

export const AboutSection: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          el.classList.add('about--visible');
        }
      },
      { threshold: 0.15 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section id="about" className="about">
      <div className="container--narrow about__inner" ref={containerRef as React.RefObject<HTMLDivElement>}>
        <h2 className="about__heading">
          About
        </h2>

        <div className="about__grid">
          <div className="about__copy">
            <p className="about__lede">
              I'm a Software Engineer who thrives on learning fast and shipping real work.
              Give me a laptop, coffee, and a deadline — and the work will be done.
            </p>

            <p>
              My sweet spot is backend — REST APIs, microservices, distributed systems, cloud
              infrastructure — but I'm comfortable across the entire stack. I've built frontends
              in React and Next.js, shipped a cross-platform Flutter app, designed AI pipelines with
              computer vision and LLMs, and wired up hardware with Arduino and NVIDIA Jetson boards.
            </p>

            <p>
              I pick up new technologies quickly because the fundamentals stay the same:
              clean architecture, data structures, system design, and engineering discipline.
              Whether it's a new framework, a new language, or an entirely new domain — I ramp up
              fast and deliver.
            </p>

            <blockquote className="about__quote">
              "I don't just talk about technologies — I build with them. Every skill listed
              here is backed by a shipped project, a working prototype, or real production code."
            </blockquote>

            <p className="about__interest-heading">What I work with</p>
            <ul className="about__interests">
              {personal.interests.map((item) => (
                <li key={item} className="about__interest">
                  <span className="about__interest-mark" aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <aside className="about__sidebar" aria-label="Skills and notes">
            <div className="field-card">
              <h4 className="field-card__title">Foundations</h4>
              <p className="field-card__body">
                Data structures & algorithms, system design, distributed systems, design patterns
                (GoF), SOLID, clean architecture, DDD, event-driven architecture, OOP.
              </p>
            </div>

            <div className="field-card">
              <h4 className="field-card__title">Core stack</h4>
              <p className="field-card__body">
                Python, Java, Node.js, TypeScript, Go, Rust, Dart. Django, FastAPI, NestJS,
                React, Next.js, Flutter. PostgreSQL, MongoDB, Redis, Kafka.
              </p>
            </div>

            <div className="field-card">
              <h4 className="field-card__title">AI & Machine Learning</h4>
              <p className="field-card__body">
                Computer vision (YOLOv8, MediaPipe, OpenCV), LLMs (GPT, Llama, Ollama),
                RAG, prompt engineering, TensorFlow, PyTorch, reinforcement learning, emotion
                detection, ASL recognition, AI automation & agent workflows.
              </p>
            </div>

            <div className="field-card">
              <h4 className="field-card__title">Beyond code</h4>
              <p className="field-card__body">
                Hardware & IoT (Arduino, NVIDIA Jetson, ROS), mobile dev (Flutter),
                DevOps (Docker, K8s, CI/CD), cloud (AWS), teaching, and mentoring.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
};
