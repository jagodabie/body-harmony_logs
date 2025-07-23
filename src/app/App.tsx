import { useState } from 'react';

import { FormBase } from '../components/FormBase/FormBase';
import { WeightLogsList } from '../components/WeightLogsList/WeightLogsList';
import { WelcomeSection } from '../components/WelcomeSection/WelcomeSection';
import { Widget } from '../components/Widget/Widget';
import { formFields } from './utils';

import './index.css';

export const App = () => {
  const [showForm, setShowForm] = useState(false);
  return (
    <div className="app">
      <header className="app-header">
        <h3>Body Harmony Logs</h3>
      </header>
      <main className="app-main">
        {!showForm && <WelcomeSection />}
        <section>
          {showForm ? (
            <FormBase
              fields={formFields}
              onSubmit={(data) =>
                console.log('Form submitted with data:', data)
              }
              formTitle="Enter your weight"
              handleClose={() => setShowForm(!showForm)}
            />
          ) : (
            <Widget
              currentWeight={70}
              bmi={22.5}
              handleClick={() => setShowForm(!showForm)}
            />
          )}
        </section>
        {/* TODO for now only logs list */}
          <WeightLogsList />
      </main>
      <footer className="app-footer">
        <p>
          &copy; {new Date().getFullYear()} Body Harmony Logs. All rights
          reserved.
        </p>
      </footer>
    </div>
  );
};
