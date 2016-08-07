Author: Abbas Abdulmalik
Created: August 6, 2016
Revised: N/A
Notes:
    This folder holds files that are only temporarily useful because
    the synchronous nature of my "rekwire" function has been "verbally" deprecated
    by the W3C. Actual deprecation will likely take years, affording me time
    to play around with simulating an NPM and CommonJS style development environment
    for the front end browser. Projects that use this folder as a template will
    use the rekwire function unless refactored to eliminate its use.
    
    The ~/bin directory has two executable bash files, apm (Abbas' package manager),
    and aml(Abbas' module loader), both of which create a "module" folder at the place
    where the scripts are invoked if a folder of that name does not alrady exist.
    Then a small collection of JavaScript files are loaded into the module folder
    from my remote "repository," a public Dropbox folder. At minimum, the two main files
    loaded will be: 
        1.) rekwire.js which contains a function name rekwire which simulates (I suppose)
        the node.js require module loader, which provides an 'exports' object that would be 
        recognized by any commonJS module that is called.
        2.) module.js which is a commonJS-like module containg my personal library
        of methods. The object returned when invoked by rekwire(module) is unique
        in that it is a function as well as an object. As a function, it is invoked
        like jQuery's $ function, with CSS-like selecors, to return a jQuery-like
        object containg my library of methods.
        
        Possible other files loaded are:
            * prefixfree.js -- a version (hopefully the latest) of Lea Verou's fine CSS utility.
            * aQuery.js -- my ancient, ugly and defective first attempt at a private JS library
            * ...  others