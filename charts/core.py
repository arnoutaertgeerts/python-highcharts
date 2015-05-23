__author__ = 'arnoutaertgeerts'

from string import Template


class MyTemplate(Template):
    delimiter = '$$'
    idpattern = r'[a-z][_a-z0-9]*'
