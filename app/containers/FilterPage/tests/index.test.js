import React from 'react';
import { render } from 'react-testing-library';
import { IntlProvider } from 'react-intl';

import FilterPage from '../index';

describe('<FilterPage />', () => {
  it('should render its heading', () => {
    const {
      container: { firstChild },
    } = render(
      <IntlProvider locale="en">
        <FilterPage />
      </IntlProvider>,
    );

    expect(firstChild).toMatchSnapshot();
  });
});
