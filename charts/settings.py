__author__ = 'Arnout Aertgeerts'

default = dict(
    options=dict(),
    type='line',
    name=False,
    height=400,
    save=False,
    stock=False,
    show='tab',
    display=True)


class Settings(dict):
    def __init__(self, **kwargs):

        super(Settings, self).__init__(
            options=dict(),
            type='line',
            name=False,
            stock=False,
            show='tab',
            save=False,
            height=400,
            display=True
        )

    def reset(self):
        self.update(default)


settings = Settings()