__author__ = 'arnout'

from setuptools import setup, find_packages

setup(
    name='charts',
    version='0.4.1',
    description='Use the highcharts js library in Python',
    url='https://github.com/arnoutaertgeerts/python-highcharts',
    author='Arnout Aertgeerts',
    author_email='arnoutaertgeerts@gmail.com',
    license='MIT',
    keywords='highcharts highstock plotting',
    packages=find_packages(),
    install_requires=[],
    package_data={
        'charts': ['*.html']
    }
)