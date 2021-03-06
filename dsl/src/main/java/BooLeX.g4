grammar BooLeX;

@header {
    package boolex.antlr;
}

// Top level declaration for a BooLeX file.
module : (circuitDeclaration | evaluations)* EOF ;

// section for evaluations
evaluations   : Eval (createCircuit | setCircuit | print)* End ;
createCircuit : Identifier Assign New Identifier (LeftParen expressionList RightParen)? ;
setCircuit    : Identifier LeftParen Integer ',' expression RightParen ;
print         : Print expressionList ;

// A module is made of many of these.
// A circuitDeclaration is the keyword circuit, followed by an identifier
// and, optionally, a list of inputs. The body of the declaration is a set
// of assignments, followed by an output statement and the End keyword.
circuitDeclaration
    : Circuit Identifier (LeftParen identifierList? RightParen)?
        assignment*
        outStatement
      End
    ;

// Simple assignment construction. A list of identifiers, =, and an expression list.
// There should be at least as many entries in the expressionList as in the identifier
// list.
assignment : identifierList Assign expressionList ;

// The word 'out' followed by a list of expressions to act as the outputs of the circuit.
outStatement : Out expressionList ;

// A comma-separated list of identifiers (at least one)
identifierList
    : Identifier
    | identifierList ',' Identifier
    ;

// A comma-separated list of expressions (at least one)
expressionList
    : expression
    | expressionList ',' expression
    ;

// A call to evaluate a circuit with a set of parameters.
circuitCall : Identifier LeftParen expressionList? RightParen ;

// A call to get a particular output from an already-evaluated circuit.
circuitIndex : Identifier LeftParen Integer RightParen ;

// A factor that can be either a call to a circuit, an identifier to be evaluated,
// a literal boolean value (either the keyword or a 0/1), or a parenthesized
// boolean expression
factor
    : '(' expression ')'
    | circuitCall
    | circuitIndex
    | Identifier
    | BooleanValue
    ;

// Recursive grammar for whole boolean expression, listed
// in decreasing order of precedence.
expression
    : factor
    | expression PostNot
    | Not expression
    | expression (And|NAnd) expression
    | expression (Xor|XNor) expression
    | expression (Or|Nor) expression
    ;

/***** Lexical Constants ******/

// Keywords
Circuit : 'circuit' ;
Out     : 'out' ;
End     : 'end' ;
Eval    : 'evaluate';
New     : 'new';
Print   : 'print';

// Operators
And     : 'and'  | '*' ;
Or      : 'or'   | '+' ;
Not     : 'not'  | '-' ;
PostNot :          '\'';
Xor     : 'xor'  | '^' ;
NAnd    : 'nand' ;
Nor     : 'nor'  ;
XNor    : 'xnor' ;

// Syntactical tokens
Assign       : '=' ;
LeftParen    : '(' ;
RightParen   : ')' ;
LeftBracket  : '[' ;
RightBracket : ']' ;

// Raw boolean value
BooleanValue : 'true' | 'false';

// Identifiers like C/C++/Java.
Identifier   : [a-zA-Z_][a-zA-Z0-9_]* ;
Integer      : [0-9]+;

// Skip whitespace, newlines, and comments.
Whitespace   : [ \t]+ -> skip ;
LineComment  : '#' ~[\r\n]* -> skip ;
Newline
    : ( '\r' '\n'?
      | '\n'
      ) -> skip
    ;
