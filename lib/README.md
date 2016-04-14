# Lib

The lib folder will contain all files will be part of the dist version.

Some of the taken decisions are the following:

## Functions

0. The compatibility will be based in the 5% rule.

## Structure

1. The basic component should be *totally* stand alone
1. The size of the compiled component should be small as possible
1. The structure of the object created will be based on the nickname of the endpoint.

	** In the next iteration it will be a method that the user will be able to set up.


## The flow of the calls will be:

2. Get the specs.
2. Register the specs of the API in the current object.
2. Create all the methods that are mapping the specs.
2. Crete an initial mapping that will be a basic interface to the main process to the real methods.

The mapping of the current object should be possible to replace. In this way will be possible to prevent between an API change and the current behavior of the app.

## Flow:

3. this.getSpec();
3. this.constructAPI();

## Random decisions taken:

4. Should the call method get the basic config params from the 'this' or as a params? Params because in this sense it is a 'util' method that just deals witht the technology over the component is running. Should be possible to abstract easily.
4. After an initial implementation the code will be converted to EMS6 and will us Babel to make it compatible with older browsers.
4. The very first coding approach will be purely personal and focused on the maximum comprehension of the code. So shameless code please!
4. To set the name of the operations to perform, a n optional object will be expected, with a mapping between nicknames and method names. If a nickname is not there, it will be used as a operation name. This is required because the 
