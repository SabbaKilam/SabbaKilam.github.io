#! /usr/bin/env bash
###############################
#  Author: Abbas Abdulmalik
#  Created: October 21, 2016
#  Revised: October 28, 2016
#  Filename: go
#  Purpose: Compiles java source code files 
#           and executes the Main class file
#  Notes:   The Main file must contain the main method
##############################

# Make Main.java write-able
sudo chmod 666 source/Main.java

# First, delete all class files
rm classes/*.class  > /dev/null 2>&1

# Then, compile new class files
javac source/*.java -d classes

# Finally, run the Main class using the command args
java -classpath classes Main `echo ${@}`
