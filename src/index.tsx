import type {
  CreateCustomVisualization,
  CustomStaticVisualizationProps,
  CustomVisualizationProps,
} from '@metabase/custom-viz';

type Settings = {
  threshold?: number;
};

const createVisualization: CreateCustomVisualization<Settings> = () => {
  return {
    id: 'viz-2',
    getName: () => 'viz-2',
    minSize: { width: 1, height: 1 },
    defaultSize: { width: 2, height: 2 },
    isSensible({ cols, rows }) {
      return cols.length === 1 && rows.length === 1 && typeof rows[0][0] === 'number';
    },
    checkRenderable(series, settings) {
      if (series.length !== 1) {
        throw new Error('Only 1 series is supported');
      }

      const [
        {
          data: { cols, rows },
        },
      ] = series;

      if (cols.length !== 1) {
        throw new Error('Query results should only have 1 column');
      }

      if (rows.length !== 1) {
        throw new Error('Query results should only have 1 row');
      }

      if (typeof rows[0][0] !== 'number') {
        throw new Error('Result is not a number');
      }

      if (typeof settings.threshold !== 'number') {
        throw new Error('Threshold setting is not set');
      }
    },
    settings: {
      threshold: {
        id: '1',
        title: 'Threshold',
        widget: 'number',
        getDefault() {
          return 0;
        },
        getProps() {
          return {
            options: {
              isInteger: false,
              isNonNegative: false,
            },
            placeholder: 'Set threshold',
          };
        },
      },
    },
    VisualizationComponent,
    StaticVisualizationComponent,
  };
};

const VisualizationComponent = (props: CustomVisualizationProps<Settings>) => {
  const { height, series, settings, width } = props;
  const { threshold } = settings;
  const value = series[0].data.rows[0][0];

  if (typeof value !== 'number' || typeof threshold !== 'number') {
    throw new Error('Value and threshold need to be numbers');
  }

  const emoji = value >= threshold ? '👍' : '👎';

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width,
        height,
        fontSize: '10rem',
      }}
    >
      {emoji}
    </div>
  );
};

const StaticVisualizationComponent = (props: CustomStaticVisualizationProps<Settings>) => {
  const width = 540;
  const height = 360;
  const { series, settings } = props;
  const { threshold = 0 } = settings;
  const value = series[0].data.rows[0][0];

  if (typeof value !== 'number' || typeof threshold !== 'number') {
    throw new Error('Value and threshold need to be numbers');
  }

  const emoji =
    value >= threshold ? (
      <img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiIgZmlsbD0iY3VycmVudENvbG9yIiBjbGFzcz0iYmkgYmktaGFuZC10aHVtYnMtdXAiIHZpZXdCb3g9IjAgMCAxNiAxNiI+CiAgPHBhdGggZD0iTTguODY0LjA0NkM3LjkwOC0uMTkzIDcuMDIuNTMgNi45NTYgMS40NjZjLS4wNzIgMS4wNTEtLjIzIDIuMDE2LS40MjggMi41OS0uMTI1LjM2LS40NzkgMS4wMTMtMS4wNCAxLjYzOS0uNTU3LjYyMy0xLjI4MiAxLjE3OC0yLjEzMSAxLjQxQzIuNjg1IDcuMjg4IDIgNy44NyAyIDguNzJ2NC4wMDFjMCAuODQ1LjY4MiAxLjQ2NCAxLjQ0OCAxLjU0NSAxLjA3LjExNCAxLjU2NC40MTUgMi4wNjguNzIzbC4wNDguMDNjLjI3Mi4xNjUuNTc4LjM0OC45Ny40ODQuMzk3LjEzNi44NjEuMjE3IDEuNDY2LjIxN2gzLjVjLjkzNyAwIDEuNTk5LS40NzcgMS45MzQtMS4wNjRhMS44NiAxLjg2IDAgMCAwIC4yNTQtLjkxMmMwLS4xNTItLjAyMy0uMzEyLS4wNzctLjQ2NC4yMDEtLjI2My4zOC0uNTc4LjQ4OC0uOTAxLjExLS4zMy4xNzItLjc2Mi4wMDQtMS4xNDkuMDY5LS4xMy4xMi0uMjY5LjE1OS0uNDAzLjA3Ny0uMjcuMTEzLS41NjguMTEzLS44NTcgMC0uMjg4LS4wMzYtLjU4NS0uMTEzLS44NTZhMiAyIDAgMCAwLS4xMzgtLjM2MiAxLjkgMS45IDAgMCAwIC4yMzQtMS43MzRjLS4yMDYtLjU5Mi0uNjgyLTEuMS0xLjItMS4yNzItLjg0Ny0uMjgyLTEuODAzLS4yNzYtMi41MTYtLjIxMWExMCAxMCAwIDAgMC0uNDQzLjA1IDkuNCA5LjQgMCAwIDAtLjA2Mi00LjUwOUExLjM4IDEuMzggMCAwIDAgOS4xMjUuMTExek0xMS41IDE0LjcyMUg4Yy0uNTEgMC0uODYzLS4wNjktMS4xNC0uMTY0LS4yODEtLjA5Ny0uNTA2LS4yMjgtLjc3Ni0uMzkzbC0uMDQtLjAyNGMtLjU1NS0uMzM5LTEuMTk4LS43MzEtMi40OS0uODY4LS4zMzMtLjAzNi0uNTU0LS4yOS0uNTU0LS41NVY4LjcyYzAtLjI1NC4yMjYtLjU0My42Mi0uNjUgMS4wOTUtLjMgMS45NzctLjk5NiAyLjYxNC0xLjcwOC42MzUtLjcxIDEuMDY0LTEuNDc1IDEuMjM4LTEuOTc4LjI0My0uNy40MDctMS43NjguNDgyLTIuODUuMDI1LS4zNjIuMzYtLjU5NC42NjctLjUxOGwuMjYyLjA2NmMuMTYuMDQuMjU4LjE0My4yODguMjU1YTguMzQgOC4zNCAwIDAgMS0uMTQ1IDQuNzI1LjUuNSAwIDAgMCAuNTk1LjY0NGwuMDAzLS4wMDEuMDE0LS4wMDMuMDU4LS4wMTRhOSA5IDAgMCAxIDEuMDM2LS4xNTdjLjY2My0uMDYgMS40NTctLjA1NCAyLjExLjE2NC4xNzUuMDU4LjQ1LjMuNTcuNjUuMTA3LjMwOC4wODcuNjctLjI2NiAxLjAyMmwtLjM1My4zNTMuMzUzLjM1NGMuMDQzLjA0My4xMDUuMTQxLjE1NC4zMTUuMDQ4LjE2Ny4wNzUuMzcuMDc1LjU4MSAwIC4yMTItLjAyNy40MTQtLjA3NS41ODItLjA1LjE3NC0uMTExLjI3Mi0uMTU0LjMxNWwtLjM1My4zNTMuMzUzLjM1NGMuMDQ3LjA0Ny4xMDkuMTc3LjAwNS40ODhhMi4yIDIuMiAwIDAgMS0uNTA1LjgwNWwtLjM1My4zNTMuMzUzLjM1NGMuMDA2LjAwNS4wNDEuMDUuMDQxLjE3YS45LjkgMCAwIDEtLjEyMS40MTZjLS4xNjUuMjg4LS41MDMuNTYtMS4wNjYuNTZ6Ii8+Cjwvc3ZnPgo=" />
    ) : (
      <img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiIgZmlsbD0iY3VycmVudENvbG9yIiBjbGFzcz0iYmkgYmktaGFuZC10aHVtYnMtZG93biIgdmlld0JveD0iMCAwIDE2IDE2Ij4KICA8cGF0aCBkPSJNOC44NjQgMTUuNjc0Yy0uOTU2LjI0LTEuODQzLS40ODQtMS45MDgtMS40Mi0uMDcyLTEuMDUtLjIzLTIuMDE1LS40MjgtMi41OS0uMTI1LS4zNi0uNDc5LTEuMDEyLTEuMDQtMS42MzgtLjU1Ny0uNjI0LTEuMjgyLTEuMTc5LTIuMTMxLTEuNDFDMi42ODUgOC40MzIgMiA3Ljg1IDIgN1YzYzAtLjg0NS42ODItMS40NjQgMS40NDgtMS41NDYgMS4wNy0uMTEzIDEuNTY0LS40MTUgMi4wNjgtLjcyM2wuMDQ4LS4wMjljLjI3Mi0uMTY2LjU3OC0uMzQ5Ljk3LS40ODRDNi45MzEuMDggNy4zOTUgMCA4IDBoMy41Yy45MzcgMCAxLjU5OS40NzggMS45MzQgMS4wNjQuMTY0LjI4Ny4yNTQuNjA3LjI1NC45MTMgMCAuMTUyLS4wMjMuMzEyLS4wNzcuNDY0LjIwMS4yNjIuMzguNTc3LjQ4OC45LjExLjMzLjE3Mi43NjIuMDA0IDEuMTUuMDY5LjEzLjEyLjI2OC4xNTkuNDAzLjA3Ny4yNy4xMTMuNTY3LjExMy44NTZzLS4wMzYuNTg2LS4xMTMuODU2Yy0uMDM1LjEyLS4wOC4yNDQtLjEzOC4zNjMuMzk0LjU3MS40MTggMS4yLjIzNCAxLjczMy0uMjA2LjU5Mi0uNjgyIDEuMS0xLjIgMS4yNzItLjg0Ny4yODMtMS44MDMuMjc2LTIuNTE2LjIxMWExMCAxMCAwIDAgMS0uNDQzLS4wNSA5LjM2IDkuMzYgMCAwIDEtLjA2MiA0LjUxYy0uMTM4LjUwOC0uNTUuODQ4LTEuMDEyLjk2NHpNMTEuNSAxSDhjLS41MSAwLS44NjMuMDY4LTEuMTQuMTYzLS4yODEuMDk3LS41MDYuMjI5LS43NzYuMzkzbC0uMDQuMDI1Yy0uNTU1LjMzOC0xLjE5OC43My0yLjQ5Ljg2OC0uMzMzLjAzNS0uNTU0LjI5LS41NTQuNTVWN2MwIC4yNTUuMjI2LjU0My42Mi42NSAxLjA5NS4zIDEuOTc3Ljk5NyAyLjYxNCAxLjcwOS42MzUuNzEgMS4wNjQgMS40NzUgMS4yMzggMS45NzcuMjQzLjcuNDA3IDEuNzY4LjQ4MiAyLjg1LjAyNS4zNjIuMzYuNTk1LjY2Ny41MThsLjI2Mi0uMDY1Yy4xNi0uMDQuMjU4LS4xNDQuMjg4LS4yNTVhOC4zNCA4LjM0IDAgMCAwLS4xNDUtNC43MjYuNS41IDAgMCAxIC41OTUtLjY0M2guMDAzbC4wMTQuMDA0LjA1OC4wMTNhOSA5IDAgMCAwIDEuMDM2LjE1N2MuNjYzLjA2IDEuNDU3LjA1NCAyLjExLS4xNjMuMTc1LS4wNTkuNDUtLjMwMS41Ny0uNjUxLjEwNy0uMzA4LjA4Ny0uNjctLjI2Ni0xLjAyMUwxMi43OTMgN2wuMzUzLS4zNTRjLjA0My0uMDQyLjEwNS0uMTQuMTU0LS4zMTUuMDQ4LS4xNjcuMDc1LS4zNy4wNzUtLjU4MXMtLjAyNy0uNDE0LS4wNzUtLjU4MWMtLjA1LS4xNzQtLjExMS0uMjczLS4xNTQtLjMxNWwtLjM1My0uMzU0LjM1My0uMzU0Yy4wNDctLjA0Ny4xMDktLjE3Ni4wMDUtLjQ4OGEyLjIgMi4yIDAgMCAwLS41MDUtLjgwNGwtLjM1My0uMzU0LjM1My0uMzU0Yy4wMDYtLjAwNS4wNDEtLjA1LjA0MS0uMTdhLjkuOSAwIDAgMC0uMTIxLS40MTVDMTIuNCAxLjI3MiAxMi4wNjMgMSAxMS41IDEiLz4KPC9zdmc+Cg==" />
    );

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width,
        height,
      }}
    >
      {emoji}
    </div>
  );
};

export default createVisualization;
